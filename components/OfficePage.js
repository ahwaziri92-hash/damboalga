import Link from "next/link";
import { NewsList } from "./News";
import ContactForm from "./ContactForm";

export default function OfficePage({ p, news, photos, wards, L, back }) {
  const tagged = news.filter(n => (n.tags || []).includes(p.tag) || n.office_key === p.office_key);
  const ha = L === "ha";
  return <>
    <Link className="back" href={back[0]}>← {back[1]}</Link>
    <div className="hero mbhero" style={{ marginTop: 10 }}>
      {p.photo_url ? <img src={p.photo_url} alt={p.name} style={{ width: 150, height: 180, objectFit: "cover", borderRadius: 14, border: "4px solid rgba(255,255,255,.4)" }} /> : <div className="ph" style={{ width: 150, height: 180 }}>👤</div>}
      <div><span className="tag" style={{ background: "#fff" }}>{p.subtitle}</span><h1 style={{ margin: ".2em 0" }}>{p.name}</h1><p style={{ margin: 0 }}>{p.role}{p.years ? ` · ${p.years}` : ""}</p></div>
    </div>
    <section className="two"><div>
      <h2>{ha ? "Takaitaccen tarihi" : "About"}</h2>
      {String(p.bio || "").split(/\n+/).map((x, i) => <p key={i}>{x}</p>)}
      <h2>{ha ? "Manufofi" : "Priorities"}</h2>
      <div className="grid">{(p.priorities || []).map(x => <div key={x} className="card"><b>{x}</b></div>)}</div>
      <h2 style={{ marginTop: 22 }}>{ha ? "Labarai" : "News"}</h2>
      {tagged.length ? <NewsList items={tagged.slice(0, 6)} photos={photos} L={L} /> : <p className="note">{ha ? "Babu labari tukuna." : "No news yet."}</p>}
      {tagged.length > 0 && <Link className="btn btnlink" href={`/news?tag=${encodeURIComponent(p.tag)}`}>{ha ? "Duk labarai" : "All news"} →</Link>}
    </div><div>
      <h2>{ha ? "Aika sako zuwa ofishin" : "Write to the office"}</h2>
      <ContactForm office={p.office_key} wards={wards} L={L} />
      <div className="card" style={{ marginTop: 12 }}><h3>{ha ? "Ofishi" : "Office"}</h3><p className="note">{p.office_info}</p></div>
    </div></section>
  </>;
}
