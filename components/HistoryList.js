"use client";
import { useState } from "react";
function Story({ n, ha }) {
  const [open, setOpen] = useState(false);
  const paras = String(n.body || "").split(/\n\s*\n/).filter(Boolean);
  const srcs = [...(n.source_url ? [{ name: n.source_name, url: n.source_url }] : []), ...(n.sources || [])].filter(x => x && x.url);
  return <article className={`hcard${open ? " open" : ""}`}>
    <button className="hthumb" onClick={() => setOpen(!open)} aria-label={n.title}>{n.image_url ? <img src={n.image_url} alt="" loading="lazy" /> : <span />}</button>
    <div className="hbody">
      <span className="hy2">{n.date_label}</span>
      <h3 onClick={() => setOpen(!open)}>{n.title}</h3>
      {(open ? paras : paras.slice(0, 1)).map((p, i) => <p key={i}>{p}</p>)}
      {open && srcs.length > 0 && <div className="hsrc"><b>{ha ? "Asali" : "Sources"}</b><ul>{srcs.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.name || s.url} ↗</a></li>)}</ul></div>}
      {paras.length > 1 || srcs.length ? <button className="hmore" onClick={() => setOpen(!open)}>{open ? (ha ? "Rufe" : "Show less") : (ha ? "Karanta cikakken labari" : "Read the full story")} {open ? "↑" : "›"}</button> : null}
    </div>
  </article>;
}
export default function HistoryList({ items, L }) {
  return <div className="hlist">{items.map((n, i) => <Story key={n.id || n.title + i} n={n} ha={L === "ha"} />)}</div>;
}
