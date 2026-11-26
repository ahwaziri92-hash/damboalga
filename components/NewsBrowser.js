"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NewsList, Avatar } from "./News";
export default function NewsBrowser({ all, photos, L }) {
  const sp = useSearchParams(); const tag = sp.get("tag") || ""; const y = sp.get("y") || "All"; const ha = L === "ha";
  const years = [...new Set(all.map(n => String(n.sort_date || "").slice(0, 4)).filter(v => v >= "2000"))].sort().reverse();
  let f = tag ? all.filter(n => (n.tags || []).includes(tag)) : all;
  if (y === "Videos") f = f.filter(n => n.is_video || n.category === "Video");
  else if (y !== "All") f = f.filter(n => String(n.sort_date || "").startsWith(y));
  const q = v => `/news?${new URLSearchParams({ ...(tag ? { tag } : {}), ...(v !== "All" ? { y: v } : {}) })}`;
  return <>
    <div className="tabs">{["All", "Videos", ...years].map(v => <Link key={v} className={v === y ? "on" : ""} href={q(v)} scroll={false}>{v === "All" ? (ha ? "Duka" : "All") : v === "Videos" ? "▶ " + (ha ? "Bidiyo" : "Videos") : v}</Link>)}<Link href="/history">{ha ? "Tarihi" : "History"} →</Link></div>
    {tag && <div className="tagbar"><Avatar name={tag} src={photos[tag]} className="tb" /><span>{ha ? "Labarai game da" : "News about"} <b>{tag}</b></span><Link href={y !== "All" ? `/news?y=${y}` : "/news"}>×</Link></div>}
    {f.length ? <NewsList key={tag + y} items={f} photos={photos} L={L} feature /> : <p className="empty">{ha ? "Babu labari." : "No stories found."}</p>}
  </>;
}
