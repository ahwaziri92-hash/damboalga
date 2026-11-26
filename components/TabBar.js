"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { CAT_ICON } from "@/components/Icon";
export default function TabBar({ labels }) {
  const path = usePathname();
  const items = [["/", "home", labels.home], ["/news", "news", labels.news], ["/wards", "map", labels.wards], ["/legislators", "landmark", labels.reps]];
  const on = h => h === "/" ? path === "/" : path.startsWith(h);
  return (
    <nav className="tabbar">
      {items.map(([h, i, l]) => <Link key={h} href={h} className={on(h) ? "on" : ""}><span><Icon name={i} size={22} /></span><b>{l}</b></Link>)}
      <button onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new Event("toggle-menu")); }}><span><Icon name="menu" size={22} /></span><b>{labels.more}</b></button>
    </nav>
  );
}
