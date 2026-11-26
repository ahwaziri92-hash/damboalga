// Reads site content from Supabase when it is connected, otherwise from lib/seed.json
import seed from "./seed.json";
import { sb, hasSupabase } from "./supabase";

async function table(name, order = "sort", filter) {
  if (!hasSupabase) return null;
  try {
    let q = sb().from(name).select("*");
    if (filter) q = filter(q);
    if (order) q = q.order(order, { ascending: true });
    const { data, error } = await q;
    if (error) throw error;
    return data;
  } catch (e) { console.error("data:", name, e.message); return null; }
}

const bySort = a => [...a].sort((x, y) => (x.sort ?? 0) - (y.sort ?? 0));
const newsSort = a => [...a].sort((x, y) => (x.date_label === "Coming soon" ? -1 : 0) - (y.date_label === "Coming soon" ? -1 : 0) || String(y.sort_date || "").localeCompare(String(x.sort_date || "")));

export async function getNews() {
  const d = await table("news", null, q => q.eq("status", "published"));
  return newsSort((d || seed.news).filter(n => n.status === "published"));
}
export async function getChairmen() { return bySort((await table("chairmen")) || seed.chairmen).filter(c => c.show !== false); }
export async function getSeats() {
  const seats = bySort((await table("seats")) || seed.seats);
  const holders = bySort((await table("seat_holders")) || seed.holders);
  return seats.map(s => ({ ...s, holders: holders.filter(h => h.seat_key === s.key) }));
}
export async function getStakeholders() {
  const all = ((await table("stakeholders")) || seed.stakeholders).filter(s => s.show !== false);
  const groups = {};
  [...all].sort((a, b) => a.grp_sort - b.grp_sort || a.sort - b.sort).forEach(s => { (groups[s.grp] ||= []).push(s); });
  return Object.entries(groups).map(([name, people]) => ({ name, people }));
}
export async function getWards() { return ((await table("wards", "n")) || seed.wards); }
export async function getServices() { return bySort((await table("services")) || seed.services); }
export async function getPrices() { return bySort((await table("market_prices")) || seed.prices); }
export async function getPartners() { return bySort((await table("partners")) || seed.partners); }
export async function getHeritage() { return bySort((await table("heritage")) || seed.heritage); }
export async function getOfficials() { return bySort((await table("officials")) || seed.officials); }
export async function getPage(slug) {
  const d = await table("pages", null, q => q.eq("slug", slug));
  return (d && d[0]) || seed.pages.find(p => p.slug === slug) || null;
}
export async function getPages() { return (await table("pages", "slug")) || seed.pages; }
export async function getSettings() {
  const d = await table("settings", null);
  if (!d) return { ...seed.settings, photos: seed.photos };
  const s = { ...seed.settings, photos: seed.photos };
  d.forEach(r => { s[r.key] = r.value; });
  return s;
}
// Photo lookup by person name (used for news thumbnails and history lists)
export async function getPhotoMap() {
  const [st, ch, ho, s] = await Promise.all([getStakeholders(), getChairmen(), getSeats(), getSettings()]);
  const m = { ...(s.photos || {}) };
  st.forEach(g => g.people.forEach(p => { if (p.photo_url) m[p.name] = p.photo_url; }));
  ch.forEach(c => { if (c.photo_url) m[c.name] = c.photo_url; });
  ho.forEach(x => x.holders.forEach(h => { if (h.photo_url) m[h.name] = h.photo_url; }));
  return m;
}
