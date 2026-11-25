import Link from "next/link";
import { getLang, tr } from "@/lib/i18n";
import { getNews, getPhotoMap } from "@/lib/data";
import { NewsList, Avatar } from "@/components/News";
export const revalidate = 60;
export default async function News({ searchParams }) {
  const sp = await searchParams; const tag = sp.tag || ""; const y = sp.y || "All";
  const L = await getLang(); const t = tr(L); const ha = L === "ha";
  const [all, photos] = await Promise.all([getNews(), getPhotoMap()]);
  const years = [...new Set(all.map(n => String(n.sort_date || "").slice(0, 4)).filter(Boolean))].sort().reverse();
  let f = tag ? all.filter(n => (n.tags || []).includes(tag)) : all;
  if (y === "Videos") f = f.filter(n => n.is_video || n.category === "Video");
  else if (y !== "All") f = f.filter(n => String(n.sort_date || "").startsWith(y));
  const q = v => `/news?${new URLSearchParams({ ...(tag ? { tag } : {}), ...(v !== "All" ? { y: v } : {}) })}`;
  return <>
    <h1>{t("news")}</h1>
    <div className="tabs">{["All", "Videos", ...years].map(v => <Link key={v} className={v === y ? "on" : ""} href={q(v)}>{v === "All" ? (ha ? "Duka" : "All") : v === "Videos" ? "▶ " + (ha ? "Bidiyo" : "Videos") : v}</Link>)}</div>
    {tag && <div className="tagbar"><Avatar name={tag} src={photos[tag]} className="tb" /><span>{ha ? "Labarai game da" : "News about"} <b>{tag}</b></span><Link href={y !== "All" ? `/news?y=${y}` : "/news"}>×</Link></div>}
    {f.length ? <NewsList items={f} photos={photos} L={L} feature /> : <p className="empty">{ha ? "Babu labari." : "No stories found."}</p>}
    <p className="note">{ha ? "Sashen Yada Labarai ne ke wallafa labarai." : "Stories are published by the LGA Information Unit."}</p>
  </>;
}
