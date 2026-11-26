"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ L, nav, stateLine }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { const f = () => setOpen(o => !o); window.addEventListener("toggle-menu", f); return () => window.removeEventListener("toggle-menu", f); }, []);
  const setLang = l => { if (l === L) return; document.cookie = `lang=${l};path=/;max-age=31536000;samesite=lax`; window.location.reload(); };
  if (path.startsWith("/admin")) return null;
  const active = h => h === "/" ? path === "/" : path.startsWith(h) || (h === "/leadership" && path.startsWith("/chairman"));
  return (
    <header>
      <div className="bar">
        <Link href="/" className="crest" aria-label="Home"><svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="#0f5132"/><path d="M15 6c3 4 3 8 0 12-3-4-3-8 0-12z" fill="#c9a227"/><path d="M8 20h14v2H8z" fill="#fff"/></svg></Link>
        <div className="brand"><b>Damboa Local Government</b><span>{stateLine}</span></div>
        <div className="lang" role="group" aria-label="Language">
          <button className={L === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={L === "ha" ? "on" : ""} onClick={() => setLang("ha")}>HA</button>
        </div>
        <button className="menu-btn" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
      </div>
      <nav className={open ? "open" : ""}><ul>{nav.map(([h, l]) => <li key={h}><Link href={h} className={active(h) ? "on" : ""}>{l}</Link></li>)}</ul></nav>
    </header>
  );
}
