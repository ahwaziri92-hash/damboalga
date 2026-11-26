"use client";
import { useState } from "react";
import Link from "next/link";
import { Modal, Avatar, NewsList } from "./News";
import Icon, { CAT_ICON } from "@/components/Icon";

export function ChairmenTimeline({ chairmen, L }) {
  const [open, setOpen] = useState(() => new Set(chairmen.filter(c => c.is_current).map(c => c.id || c.name)));
  const tog = k => setOpen(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  return <div className="tl">
    <div className="tli"><div className="card"><div className="person"><div className="ph"><Icon name="landmark" size={34} stroke={1.6} /></div><div><div className="yrs">1976</div><h3 style={{ margin: ".1em 0" }}>Damboa LGA created</h3><div className="note">{L === "ha" ? "Ana tattara cikakken jerin shugabanni." : "The full list of chairmen since 1976 is being compiled from council records."}</div></div></div></div></div>
    {chairmen.map(p => { const k = p.id || p.name; return (
      <div key={k} className={`tli${p.is_current ? " cur" : ""}${open.has(k) ? " open" : ""}`}>
        <button onClick={() => tog(k)}><div className="card"><div className="person"><Avatar name={p.name} src={p.photo_url} /><div>
          <div className="yrs">{p.years}</div><h3 style={{ margin: ".1em 0" }}>{p.name}</h3><div className="note">{p.role}</div>
          <div className="bio">{p.bio}{p.is_current && <><br /><Link className="btn btnlink" style={{ marginTop: 8 }} href="/chairman" onClick={e => e.stopPropagation()}>{L === "ha" ? "Bude shafin Shugaba" : "Open the Chairman’s page"} →</Link></>}</div>
        </div></div></div></button>
      </div>); })}
  </div>;
}

export function Stakeholders({ groups, news, photos, L }) {
  const [g, setG] = useState(0);
  const [p, setP] = useState(null);
  const tagged = p ? news.filter(n => (n.tags || []).includes(p.name)) : [];
  const tbd = x => x.status === "To be added";
  return <>
    <div className="tabs">{groups.map((x, i) => <button key={x.name} className={i === g ? "on" : ""} onClick={() => setG(i)}>{x.name}</button>)}</div>
    <div className="skgrid">{groups[g].people.map(x => (
      <button key={x.id || x.name} className="sk" onClick={() => setP(x)}>
        {tbd(x) ? <div className="ph">＋</div> : <Avatar name={x.name} src={x.photo_url} />}
        <div><h3>{x.name}</h3><div className="note">{x.title}</div>{x.status && <div className="yrs">{x.status}</div>}<span className="nmore">{L === "ha" ? "Karanta tarihinsa" : "Read profile"} ›</span></div>
      </button>))}</div>
    {p && <Modal onClose={() => setP(null)}>
      <div className="mhead">{tbd(p) ? <div className="ph">＋</div> : <Avatar name={p.name} src={p.photo_url} />}<div><span className="tag">{groups[g].name}</span><h2 style={{ margin: ".2em 0" }}>{p.name}</h2><div className="note">{p.title}</div>{p.status && <div className="yrs">{p.status}</div>}</div></div>
      <h3>{L === "ha" ? "Takaitaccen tarihi" : "Short biography"}</h3><p>{p.bio}</p>
      {(p.achievements || []).length > 0 && <><h3>{L === "ha" ? "Muhimman nasarori" : "Key achievements"}</h3><ul className="ach">{p.achievements.map(a => <li key={a}>{a}</li>)}</ul></>}
      {p.is_current && <><h3>{L === "ha" ? "Sabbin labarai" : "Latest updates"}</h3>
        {tagged.length ? <><NewsList items={tagged.slice(0, 3)} photos={photos} L={L} /><Link className="btn btnlink" href={`/news?tag=${encodeURIComponent(p.name)}`}>{L === "ha" ? "Duk labarai game da shi" : "All news about him"} →</Link></> : <p className="note">{L === "ha" ? "Babu labari tukuna." : "No news tagged yet."}</p>}</>}
    </Modal>}
  </>;
}

export function Seats({ seats, photos, wards, L }) {
  const [open, setOpen] = useState({});
  const [form, setForm] = useState({});
  return <div className="seats">{seats.map(g => (
    <div key={g.key} className={`seat${open[g.key] ? " open" : ""}`}>
      <button className="seathead" onClick={() => setOpen(o => ({ ...o, [g.key]: !o[g.key] }))}>
        <Avatar name={g.current_name} src={g.photo_url} />
        <div style={{ flex: 1, textAlign: "left" }}><span className="tag">{g.chamber}</span><h3 style={{ margin: ".15em 0" }}>{g.current_name}</h3><div className="note">{g.title}</div><div className="yrs">{g.current_years}</div></div><span className="chev">▾</span>
      </button>
      {g.candidate?.name && <Link className="cand" href={g.candidate.slug ? `/legislators/${g.candidate.slug}` : "#"}>
        <Avatar name={g.candidate.name} src={g.candidate.photo_url} /><div><span className="note">{L === "ha" ? "Dan takara" : "Candidate"}</span><b>{g.candidate.name}</b><span className="note">{g.candidate.label}</span></div>{g.candidate.slug && <span className="go">{L === "ha" ? "Bude shafi" : "Open page"} →</span>}
      </Link>}
      <div className="seatbody">
        {g.area && <p className="note" style={{ marginTop: 12 }}><b>{L === "ha" ? "Yanki" : "Area"}:</b> {g.area}</p>}
        <h4>{L === "ha" ? "Wadanda suka rike kujerar tun 1999" : "Holders of this seat since 1999"}</h4>
        <ol className="hist">{g.holders.map(h => { const feat = h.name === g.current_name && g.page_slug; const inner = <><span className="hy">{h.years}</span>{(h.photo_url || photos[h.name]) && <img className="hav" src={h.photo_url || photos[h.name]} alt="" />}<b>{h.name}</b><span className="note">{h.note}</span>{feat && <span className="go"> {L === "ha" ? "Bude shafi" : "Open page"} →</span>}</>;
          return <li key={h.id || h.years + h.name} className={h.is_current ? "cur" : ""}>{feat ? <Link href={`/legislators/${g.page_slug}`}>{inner}</Link> : inner}</li>; })}</ol>
        {!g.page_slug && <>
          {(g.updates || []).length > 0 && <><h4>{L === "ha" ? "Sabbin bayanai" : "Updates"}</h4><ul className="upd">{g.updates.map(u => <li key={u.text}><span className="note">{u.label}</span> {u.text}</li>)}</ul></>}
          {!form[g.key] ? <button className="btn" onClick={() => setForm(f => ({ ...f, [g.key]: true }))}>{L === "ha" ? "Tuntubi ofishinsa" : "Contact their office"}</button>
            : <FormSlot office={g.key} wards={wards} L={L} />}
        </>}
      </div>
    </div>))}</div>;
}
import ContactForm from "./ContactForm";
function FormSlot(props) { return <div style={{ marginTop: 12 }}><ContactForm {...props} /></div>; }

export function Services({ services, news, prices, L }) {
  const [v, setV] = useState(null);
  const nw = v ? news.filter(n => n.service_key === v.key) : [];
  return <>
    <div className="grid">{services.map(s => (
      <button key={s.key} className="card svc" onClick={() => setV(s)}>
        <div className="quick" style={{ display: "flex", gap: 10 }}><span className="ico"><Icon name={s.icon} size={22} /></span><div><h3 style={{ margin: 0 }}>{s.name}</h3><div className="note pinl"><Icon name="pin" size={14} /> {s.location}</div></div></div>
        <p>{s.description}</p><span className="nmore">{L === "ha" ? "Bayanai da labarai" : "Details and updates"} ›</span>
      </button>))}</div>
    {v && <Modal onClose={() => setV(null)}>
      <div className="mhead"><div className="ph"><Icon name={v.icon} size={40} stroke={1.6} /></div><div><h2 style={{ margin: ".1em 0" }}>{v.name}</h2><div className="note pinl"><Icon name="pin" size={14} /> {v.location}</div></div></div>
      <p>{v.description}</p>
      {v.show_prices && <><h3>{L === "ha" ? "Farashin kayan abinci na mako" : "This week's food prices"}</h3>
        <table className="keep"><tbody><tr><th>Item</th><th>Measure</th><th>Price (₦)</th><th>Change</th></tr>
          {prices.map(r => <tr key={r.id || r.item}><td>{r.item}</td><td>{r.measure}</td><td>{r.price || <span className="note">—</span>}</td><td>{r.change || <span className="note">—</span>}</td></tr>)}</tbody></table>
        <p className="note">{L === "ha" ? "Kungiyar kasuwa ce ke sabunta farashin kowane mako." : "Prices are updated weekly by the market association."}</p></>}
      <h3>{L === "ha" ? "Labarai da sanarwa" : "News and notices"}</h3>
      {nw.length ? <NewsList items={nw} photos={{}} L={L} /> : <p className="note">{L === "ha" ? "Babu sanarwa tukuna." : "No updates yet."}</p>}
    </Modal>}
  </>;
}
