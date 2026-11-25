# Damboa Local Government Area – official website

Phone-first website for Damboa LGA, Borno State, with an admin panel for the LGA Administration and Information Unit.
Technical support: Youth for Digital Change (Y4DC), powered by Chirallia Information Technology and Innovation (CITI).

- **Public site:** Home, About, Leadership (chairmen timeline, council, stakeholders), Chairman's page, Legislators (seat history since 1999) with an own page for the State Assembly member, Wards & Villages (GRID3 map, INEC polling units), News (photo and video stories, people tags, year filters), Humanitarian, Political Activities, Services & Contact. English and Hausa.
- **Admin (`/admin`):** works on a phone. Add, edit and remove news (photo and video upload, YouTube links, tags), office pages, chairmen, seats and history, stakeholders, wards and councillors, officials, services, market prices, partners, heritage and site settings. Messages inbox, approvals queue and user roles.

Built with Next.js 15 and Supabase (database, login and photo storage). Without Supabase keys the site runs on the sample content in `lib/seed.json`.

## Roles

| Role | Can do |
|---|---|
| super_admin | Everything, including giving roles to users |
| editor | Information Unit: all content, settings and messages |
| approver | Approves political stories and stories from office accounts (for the Executive Chairman) |
| office_admin | One office (e.g. `state-member`): its own page, news and messages. Its stories always wait for approval |
| pending | New sign-up with no access yet |

Political stories can only be published by an approver or super admin. This rule is enforced in the database, not only in the screens.

## Set up (about 20 minutes)

1. **Supabase:** create a free project at supabase.com. In *SQL editor*, run `supabase/schema.sql`, then `supabase/seed.sql` (the starting content).
2. **Vercel:** import this GitHub repo at vercel.com. Under *Environment variables* add the two values from Supabase *Project settings → API*:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   Deploy.
3. **First admin:** open `https://<your-site>/admin`, choose *New staff account* and sign up. Confirm the email, then in Supabase SQL editor run:
   ```sql
   update profiles set role = 'super_admin' where id = (select id from auth.users where email = 'you@example.com');
   ```
   Sign in again. Other staff sign up the same way and you give them a role under **Users**.
4. **Auth settings (Supabase → Authentication → URL configuration):** set *Site URL* to your site address so confirmation and password-reset links work.
5. **Domain:** add the LGA domain in Vercel when it is ready.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional – leave empty to use the sample content
npm run dev
```

`npm run seed:sql` rebuilds `supabase/seed.sql` from `lib/seed.json`.

## Where things are

- `app/` – pages (`app/admin` is the admin panel)
- `components/` – shared parts (news, map, forms, people); `components/admin/config.js` lists every editable table and field
- `lib/data.js` – reads content from Supabase, or the sample file
- `supabase/schema.sql` – tables, security rules, approval rule and photo storage
- Map data: GRID3 Nigeria ward boundaries and settlements (2026). Polling units: INEC register.
