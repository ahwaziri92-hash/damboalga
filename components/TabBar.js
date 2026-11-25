"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function TabBar({ labels }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  const items = [["/", "🏠", labels.home], ["/news", "📰", labels.news], ["/wards", "🗺", labels.wards], ["/legislators", "🏛", labels.reps]];
  const on = h => h === "/" ? path === "/" : path.startsWith(h);
  return (
    <nav className="tabbar">
      {items.map(([h, i, l]) => <Link key={h} href={h} className={on(h) ? "on" : ""}><span>{i}</span><b>{l}</b></Link>)}
      <button onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new Event("toggle-menu")); }}><span>☰</span><b>{labels.more}</b></button>
    </nav>
  );
}
