"use client";
import { useState } from "react";
import Link from "next/link";
import { MAP } from "@/lib/mapdata";

function Svg({ wards, sel, onPick, pins = true }) {
  let dots = "";
  for (let i = 0; i + 6 <= MAP.SETS.length; i += 6) dots += `M${+MAP.SETS.slice(i, i + 3)},${+MAP.SETS.slice(i + 3, i + 6)}h.1`;
  return (
    <svg viewBox={`0 0 ${MAP.MAPW} ${MAP.MAPH}`} role="img" aria-label="Map of Damboa LGA and its wards">
      <rect width={MAP.MAPW} height={MAP.MAPH} fill="#efebe2" />
      {MAP.NBR.map(n => <path key={n[0]} d={n[1]} fill="#f6f3ec" stroke="#c9bfae" strokeWidth="1.2" />)}
      <g className="nl">{MAP.NBRL.filter(l => l[1] > 0).map(l => <text key={l[0]} x={l[1]} y={l[2]}>{l[0]}</text>)}</g>
      {wards.map((w, i) => <path key={w.n} className={`ward${sel === w.n ? " sel" : ""}`} d={MAP.WP2[i]} onClick={() => onPick(w.n)}><title>{w.name}</title></path>)}
      <path d={dots} stroke="#7a8a80" strokeWidth="2.6" strokeLinecap="round" opacity=".55" pointerEvents="none" />
      {wards.map(w => { const c = MAP.LBL2[w.n]; const lines = w.name.split(" / "); return lines.map((ln, i) => <text key={w.n + ln} className={`wl${sel === w.n ? " sel" : ""}`} x={c[0]} y={c[1] + (i - (lines.length - 1) / 2) * 14}>{ln}</text>); })}
      {pins && MAP.PINS2.filter(p => !["Bego", "Nzuda", "Garjang", "Wawa"].includes(p[0])).map(p => <g key={p[0]}><circle cx={p[1]} cy={p[2]} r="3.4" fill="#1d2b24" stroke="#fff" /><text className="pl" x={p[1] + 6} y={p[2] - 5}>{p[0]}</text></g>)}
      {MAP.TOWNS.map(t => <g key={t[0]}><rect x={t[1] - 5} y={t[2] - 5} width="10" height="10" fill="#5b4a2e" stroke="#fff" strokeWidth="2" /><text className="pl" x={t[1] + 9} y={t[2] + 4} style={{ fontSize: 14, fontWeight: 700 }}>{t[0]}</text></g>)}
      <circle cx={MAP.DHQ[0]} cy={MAP.DHQ[1]} r="9" fill="#c9a227" stroke="#fff" strokeWidth="3" />
      <text className="pl" x={MAP.DHQ[0] + 12} y={MAP.DHQ[1] - 10} style={{ fontSize: 15, fontWeight: 700 }}>Damboa town (HQ)</text>
      <g transform="translate(630,528)"><rect width="129" height="6" fill="#1d2b24" /><rect width="64" height="6" fill="#fff" stroke="#1d2b24" /><text y="-6" fontSize="12">0</text><text x="108" y="-6" fontSize="12">20 km</text></g>
      <g transform="translate(790,520)"><path d="M0 -22 L8 0 L0 -7 L-8 0z" fill="#1d2b24" /><text y="16" fontSize="13" textAnchor="middle" fontWeight="700">N</text></g>
    </svg>
  );
}

export function HomeMap({ wards }) {
  return <div className="mapwrap"><Link href="/wards" aria-label="Open wards map"><Svg wards={wards} sel={0} onPick={() => {}} /></Link></div>;
}

export default function WardMap({ wards, L = "en" }) {
  const [sel, setSel] = useState(5);
  const w = wards.find(x => x.n === sel);
  return (
    <div className="two">
      <div className="mapwrap"><Svg wards={wards} sel={sel} onPick={setSel} /></div>
      <div className="wardpanel">
        <span className="tag">Ward {w.n}</span><h2>{w.name}</h2>
        <div className="card" style={{ display: "flex", gap: 12, alignItems: "center", background: "var(--gl)", border: 0 }}>
          <div className="ph" style={{ width: 64, height: 76, fontSize: "1.2rem" }}>👤</div>
          <div><div className="note">{L === "ha" ? "Kansila" : "Councillor"}</div><b>{w.councillor || (L === "ha" ? "Za a kara" : "To be added")}</b><div className="note">{w.councillor_phone || ""}</div></div>
        </div>
        <div className="facts" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 10 }}>
          <div className="fact"><b>{w.polling_units.length}</b><span>{L === "ha" ? "rumfunan zabe" : "polling units"}</span></div>
          <div className="fact"><b>{w.villages.length}</b><span>{L === "ha" ? "Manyan kauyuka" : "Main villages"}</span></div>
        </div>
        <h3 style={{ marginTop: 14 }}>{L === "ha" ? "Kauyuka" : "Villages"}</h3>
        <div className="chips">{w.villages.map(x => <span key={x}>{x}</span>)}</div>
        <details style={{ marginTop: 12 }}><summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--g)" }}>{L === "ha" ? "Duk rumfunan zabe" : "All polling units (INEC)"} – {w.polling_units.length}</summary>
          <ol style={{ columns: 2, fontSize: ".85rem", paddingLeft: 20 }}>{w.polling_units.map(x => <li key={x}>{x}</li>)}</ol></details>
      </div>
    </div>
  );
}
