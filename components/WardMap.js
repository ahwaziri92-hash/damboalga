"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { MAP } from "@/lib/mapdata";
import { BORNO } from "@/lib/borno-lgas";
import Icon from "./Icon";

// Map styling shared with the Y4DC live map
const BG = "#163a3f", EDGE = "#10292d", SEL = "#ffefd2", ACC = "#f5a89a";
const BUCKETS = [[0, 15, "#2f6f70", "≤15"], [16, 19, "#3e8a89", "16–19"], [20, 24, "#6ab0af", "20–24"], [25, 99, "#9fd1cf", "25+"]];
const fillFor = n => (BUCKETS.find(b => n >= b[0] && n <= b[1]) || BUCKETS[0])[2];

function Locator() {
  return <svg viewBox={`0 0 ${BORNO.w} ${BORNO.h}`} className="loc" aria-hidden="true">
    {BORNO.lgas.map(l => <path key={l.n} d={l.d} fill={l.n === "Damboa" ? ACC : "#2c5a5f"} stroke="#163a3f" strokeWidth="2" />)}
  </svg>;
}

function Svg({ wards, sel, onPick, interactive = true, villages = false }) {
  const W = MAP.MAPW, H = MAP.MAPH;
  const [vb, setVb] = useState([0, 0, W, H]);
  const drag = useRef(null); const ref = useRef(null);
  const zoom = vb[2] / W;
  const setZoom = f => { const [x, y, w, h] = vb; const nw = Math.min(W, Math.max(W / 5, w * f)), nh = nw * H / W; setVb([x + (w - nw) / 2, y + (h - nh) / 2, nw, nh]); };
  const down = e => { if (interactive) drag.current = { x: e.clientX, y: e.clientY, vb, moved: false }; };
  const move = e => { const d = drag.current; if (!d || !ref.current) return; const k = d.vb[2] / ref.current.clientWidth; const dx = (e.clientX - d.x) * k, dy = (e.clientY - d.y) * k; if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true; if (d.moved && zoom < 1) setVb([d.vb[0] - dx, d.vb[1] - dy, d.vb[2], d.vb[3]]); };
  const up = () => setTimeout(() => { drag.current = null; }, 0);
  const pick = n => { if (!drag.current?.moved) onPick(n); };
  let dots = "";
  if (villages) for (let i = 0; i + 6 <= MAP.SETS.length; i += 6) dots += `M${+MAP.SETS.slice(i, i + 3)},${+MAP.SETS.slice(i + 3, i + 6)}h.1`;
  return <div className="mapbox">
    <svg ref={ref} viewBox={vb.join(" ")} role="img" aria-label="Map of Damboa LGA and its wards" style={{ touchAction: zoom < 1 ? "none" : "pan-y" }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={BG} />
      {MAP.NBR.map(n => <path key={n[0]} d={n[1]} fill="#1d4a50" stroke="#ffffff" strokeOpacity=".35" strokeWidth={1.2 * zoom} />)}
      {MAP.NBRL.filter(l => l[1] > 0).map(l => <text key={l[0]} x={l[1]} y={l[2]} className="mnl" style={{ fontSize: 15 * Math.max(zoom, .6) }}>{l[0]}</text>)}
      {wards.map((w, i) => <path key={w.n} d={MAP.WP2[i]} fill={sel === w.n ? SEL : fillFor(w.polling_units.length)} stroke={sel === w.n ? "#fff" : EDGE} strokeWidth={(sel === w.n ? 3 : 1.4) * zoom} onClick={() => pick(w.n)} style={{ cursor: "pointer" }}><title>{w.name}</title></path>)}
      {villages && <path d={dots} stroke="#ffefd2" strokeWidth={2.6 * zoom} strokeLinecap="round" opacity=".55" pointerEvents="none" />}
      {wards.map(w => { const c = MAP.LBL2[w.n]; const lines = w.name.split(" / "); const on = sel === w.n; return lines.map((ln, i) => <text key={w.n + ln} x={c[0]} y={c[1] + (i - (lines.length - 1) / 2) * 21 * zoom} className="mwl" style={{ fontSize: 19 * zoom, fill: on ? "#163a3f" : "#fff", stroke: on ? SEL : BG, strokeWidth: 4 * zoom }}>{ln}</text>); })}
      {MAP.TOWNS.map(t => <g key={t[0]}><rect x={t[1] - 5 * zoom} y={t[2] - 5 * zoom} width={10 * zoom} height={10 * zoom} fill={ACC} stroke={BG} strokeWidth={2 * zoom} /><text x={t[1] + 9 * zoom} y={t[2] + 4 * zoom} className="mpl" style={{ fontSize: 17 * zoom, strokeWidth: 4 * zoom }}>{t[0]}</text></g>)}
      <circle cx={MAP.DHQ[0]} cy={MAP.DHQ[1]} r={8 * zoom} fill="#c9a227" stroke="#fff" strokeWidth={2.5 * zoom} pointerEvents="none" />
      <text x={MAP.DHQ[0] + 12 * zoom} y={MAP.DHQ[1] + 22 * zoom} className="mpl" style={{ fontSize: 15 * zoom, fontWeight: 700, strokeWidth: 4 * zoom }}>HQ</text>
    </svg>
    {interactive && <div className="mzoom">
      <button onClick={() => setZoom(0.6)} aria-label="Zoom in">+</button>
      <button onClick={() => setZoom(1 / 0.6)} aria-label="Zoom out">−</button>
      <button onClick={() => setVb([0, 0, W, H])} aria-label="Reset map">⟲</button>
    </div>}
    <div className="mloc"><Locator /><span>Borno</span></div>
  </div>;
}

function Legend({ L }) {
  return <div className="mleg">{BUCKETS.map(b => <span key={b[3]}><i style={{ background: b[2] }} />{b[3]}</span>)}<span className="mleg-t">{L === "ha" ? "Rumfunan zabe a kowace mazaba" : "Polling units per ward"}</span></div>;
}

export function HomeMap({ wards, L }) {
  return <Link href="/wards" className="mapcard" aria-label="Open wards map"><Svg wards={wards} sel={0} onPick={() => {}} interactive={false} /><Legend L={L} /></Link>;
}

export default function WardMap({ wards, L = "en" }) {
  const [sel, setSel] = useState(5);
  const [vil, setVil] = useState(false);
  const w = wards.find(x => x.n === sel);
  return (
    <div className="two">
      <div className="mapcard">
        <Svg wards={wards} sel={sel} onPick={setSel} villages={vil} />
        <div className="mbar"><Legend L={L} /><label className="mvil"><input type="checkbox" checked={vil} onChange={e => setVil(e.target.checked)} /> {L === "ha" ? "Nuna kauyuka" : "Show settlements"}</label></div>
        <p className="mhint">{L === "ha" ? "Taba mazaba don ganin bayanai. Yi amfani da +/− don zuƙowa." : "Tap a ward to see its details. Use +/− to zoom and drag to move."}</p>
      </div>
      <div className="wardpanel">
        <span className="tag">Ward {w.n}</span><h2>{w.name}</h2>
        <div className="card" style={{ display: "flex", gap: 12, alignItems: "center", background: "var(--gl)", border: 0 }}>
          <div className="ph" style={{ width: 64, height: 76 }}><Icon name="user" size={28} /></div>
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
