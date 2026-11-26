-- Damboa LGA website: database schema, roles and security
-- Run this once in the Supabase SQL editor, then run seed.sql.

create extension if not exists "pgcrypto";

-- ---------- Admin users and roles ----------
-- role: super_admin | editor | office_admin | approver
-- office_key (for office_admin): chairman | state-member | reps | senate
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'pending' check (role in ('pending','super_admin','editor','office_admin','approver')),
  office_key text,
  created_at timestamptz default now()
);

create or replace function my_role() returns text language sql stable security definer set search_path = public as
$$ select role from profiles where id = auth.uid() $$;
create or replace function my_office() returns text language sql stable security definer set search_path = public as
$$ select office_key from profiles where id = auth.uid() $$;
create or replace function is_staff() returns boolean language sql stable security definer set search_path = public as
$$ select coalesce((select role in ('super_admin','editor') from profiles where id = auth.uid()), false) $$;

-- New sign-ups get a profile with role 'pending'; a super admin gives them a real role
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email)) on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- ---------- Content ----------
create table if not exists settings (key text primary key, value jsonb);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  date_label text not null,
  sort_date date,
  category text not null default 'Governance',
  title text not null,
  body text,
  tags text[] default '{}',
  service_key text,
  is_video boolean default false,
  video_url text,
  image_url text,
  source_name text,
  source_url text,
  sources jsonb default '[]',
  status text not null default 'draft' check (status in ('draft','pending','published')),
  office_key text,
  created_by uuid references auth.users(id),
  approved_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists chairmen (
  id uuid primary key default gen_random_uuid(),
  sort int default 0, name text not null, role text, years text, bio text,
  photo_url text, is_current boolean default false, show boolean default true
);

create table if not exists seats (
  key text primary key, sort int default 0, chamber text, title text, area text,
  current_name text, current_years text, photo_url text, page_slug text, updates jsonb default '[]', candidate jsonb
);

create table if not exists seat_holders (
  id uuid primary key default gen_random_uuid(),
  seat_key text references seats(key) on delete cascade,
  sort int default 0, years text, name text, note text, is_current boolean default false, photo_url text
);

create table if not exists stakeholders (
  id uuid primary key default gen_random_uuid(),
  grp text not null, grp_sort int default 0, sort int default 0,
  name text not null, title text, status text, bio text, achievements text[] default '{}',
  is_current boolean default false, photo_url text, show boolean default true
);

create table if not exists wards (
  n int primary key, name text not null, councillor text, councillor_phone text,
  villages text[] default '{}', polling_units text[] default '{}'
);

create table if not exists services (
  key text primary key, sort int default 0, icon text, name text, location text,
  description text, show_prices boolean default false
);

create table if not exists market_prices (
  id uuid primary key default gen_random_uuid(),
  sort int default 0, item text, measure text, price text, change text, updated_at timestamptz default now()
);

create table if not exists partners (id uuid primary key default gen_random_uuid(), sort int default 0, name text, description text);
create table if not exists heritage (id uuid primary key default gen_random_uuid(), sort int default 0, icon text, title text, body text, note text, image_url text);
create table if not exists officials (id uuid primary key default gen_random_uuid(), sort int default 0, office text, name text, phone text);

create table if not exists pages (
  slug text primary key, office_key text, name text, role text, subtitle text, years text,
  photo_url text, tag text, bio text, priorities text[] default '{}', office_info text
);

-- Messages from the public contact forms
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  office_key text not null default 'lga',
  name text, phone text, ward text, village text, topic text, body text,
  status text not null default 'new' check (status in ('new','read','replied','closed')),
  created_at timestamptz default now()
);

-- ---------- Political content needs approval ----------
create or replace function news_guard() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then new.created_by := coalesce(new.created_by, auth.uid()); end if;
  -- office admins can only post for their own office
  if my_role() = 'office_admin' then new.office_key := my_office(); end if;
  -- political stories go to "pending" unless an approver or super admin publishes them
  if new.category = 'Politics' and new.status = 'published'
     and coalesce(my_role(),'') not in ('super_admin','approver') then
    new.status := 'pending';
  end if;
  -- office admins' stories always need review by the Information Unit
  if my_role() = 'office_admin' and new.status = 'published' then new.status := 'pending'; end if;
  if new.status = 'published' and my_role() in ('super_admin','approver','editor') then new.approved_by := auth.uid(); end if;
  return new;
end $$;
drop trigger if exists trg_news_guard on news;
create trigger trg_news_guard before insert or update on news for each row execute function news_guard();

-- ---------- Row level security ----------
alter table profiles enable row level security;
alter table settings enable row level security;
alter table news enable row level security;
alter table chairmen enable row level security;
alter table seats enable row level security;
alter table seat_holders enable row level security;
alter table stakeholders enable row level security;
alter table wards enable row level security;
alter table services enable row level security;
alter table market_prices enable row level security;
alter table partners enable row level security;
alter table heritage enable row level security;
alter table officials enable row level security;
alter table pages enable row level security;
alter table messages enable row level security;

-- profiles: users see themselves; super admins manage everyone
drop policy if exists p_profiles_self on profiles;
create policy p_profiles_self on profiles for select using (id = auth.uid() or my_role() = 'super_admin');
drop policy if exists p_profiles_admin on profiles;
create policy p_profiles_admin on profiles for all using (my_role() = 'super_admin') with check (my_role() = 'super_admin');

-- public read for everything published / shown
do $$ declare t text; begin
  foreach t in array array['settings','chairmen','seats','seat_holders','stakeholders','wards','services','market_prices','partners','heritage','officials','pages'] loop
    execute format('drop policy if exists p_read on %I', t);
    execute format('create policy p_read on %I for select using (true)', t);
    execute format('drop policy if exists p_staff on %I', t);
    execute format('create policy p_staff on %I for all using (is_staff()) with check (is_staff())', t);
  end loop;
end $$;

-- office admins may edit their own page
drop policy if exists p_pages_office on pages;
create policy p_pages_office on pages for update using (my_role() = 'office_admin' and office_key = my_office()) with check (office_key = my_office());

-- news
drop policy if exists p_news_public on news;
create policy p_news_public on news for select using (status = 'published' or auth.uid() is not null);
drop policy if exists p_news_staff on news;
create policy p_news_staff on news for all using (my_role() in ('super_admin','editor','approver')) with check (my_role() in ('super_admin','editor','approver'));
drop policy if exists p_news_office on news;
create policy p_news_office on news for all using (my_role() = 'office_admin' and office_key = my_office()) with check (my_role() = 'office_admin');

-- messages: anyone can send; staff see all, offices see their own
drop policy if exists p_msg_insert on messages;
create policy p_msg_insert on messages for insert with check (true);
drop policy if exists p_msg_staff on messages;
create policy p_msg_staff on messages for all using (is_staff());
drop policy if exists p_msg_office on messages;
create policy p_msg_office on messages for all using (my_role() = 'office_admin' and office_key = my_office());

-- ---------- Photo and video storage ----------
insert into storage.buckets (id, name, public) values ('media','media', true) on conflict (id) do nothing;
drop policy if exists p_media_read on storage.objects;
create policy p_media_read on storage.objects for select using (bucket_id = 'media');
drop policy if exists p_media_write on storage.objects;
create policy p_media_write on storage.objects for insert with check (bucket_id = 'media' and auth.uid() is not null);
drop policy if exists p_media_update on storage.objects;
create policy p_media_update on storage.objects for update using (bucket_id = 'media' and auth.uid() is not null);

-- upgrades for databases created before these columns existed
alter table seats add column if not exists candidate jsonb;
alter table news add column if not exists sources jsonb default '[]';
alter table heritage add column if not exists image_url text;
