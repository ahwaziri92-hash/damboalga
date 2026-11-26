"use client";
import Link from "next/link";
import { useState } from "react";
import Icon, { CAT_ICON } from "@/components/Icon";

function ytId(u) { const m = (u || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; }

export function NewsItem({ n, photos = {}, feat, L = "en" }) {
  const [open, setOpen] = useState(false);
  const tagPhoto = (n.tags || []).map(x => photos[x]).find(Boolean);
  const thumb = n.image_url || tagPhoto;
  const yt = ytId(n.video_url);
  return (
    <article className={`nart${feat ? " feat" : ""}${n.is_video ? " isvid" : ""}${open ? " open" : ""}`} onClick={() => setOpen(!open)}>
      <div className={`nthumb n-${n.is_video ? "Video" : n.category}`}>
        {thumb && <img className="nimg" src={thumb} alt="" />}
        {n.is_video ? <><span className="play"><Icon name="play" size={26} /></span><span className="vlab">VIDEO</span></> : (!thumb && <span className="nico"><Icon name={CAT_ICON[n.category] || "news"} size={34} stroke={1.6} /></span>)}
      </div>
      <div className="nbody">
        <div className="nmeta"><b>{n.category}</b> · {n.date_label}</div>
        {(n.tags || []).length > 0 && <div className="ntags">{n.tags.map(x => <Link key={x} href={`/news?tag=${encodeURIComponent(x)}`} onClick={e => e.stopPropagation()}><span>@ {x}</span></Link>)}</div>}
        <h3>{n.title}</h3>
        {open && n.is_video && (yt
          ? <div className="videobox" onClick={e => e.stopPropagation()}><iframe src={`https://www.youtube-nocookie.com/embed/${yt}`} title={n.title} allowFullScreen loading="lazy" /></div>
          : n.video_url ? <div className="videobox" onClick={e => e.stopPropagation()}><video src={n.video_url} controls preload="none" /></div> : null)}
        {open && n.image_url && !n.is_video && <img className="nimgbig" src={n.image_url} alt="" />}
        <p className="nex">{n.body}</p>
        {n.source_url && <a className="nsrc" href={n.source_url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>{L === "ha" ? "Asali" : "Source"}: {n.source_name || "link"} ↗</a>}
        {!open && <span className="nmore">{L === "ha" ? "Kara karantawa" : "Read more"} ›</span>}
      </div>
    </article>
  );
}

export function NewsList({ items, photos, L, feature = false }) {
  if (!items.length) return <p className="empty">{L === "ha" ? "Babu labari tukuna." : "No stories yet."}</p>;
  const [first, ...rest] = items;
  return <>
    {feature && <NewsItem n={first} photos={photos} feat L={L} />}
    <div className="nlist">{(feature ? rest : items).map((n, i) => <NewsItem key={n.id || n.title + i} n={n} photos={photos} L={L} />)}</div>
  </>;
}

export function Modal({ onClose, children }) {
  return <div id="modal" className="on"><div className="mback" onClick={onClose} /><div className="mbox"><button className="mx" onClick={onClose} aria-label="Close">×</button><div className="mbody">{children}</div></div></div>;
}

export function initials(n) {
  return n.replace(/^(Hon\.|Prof\.|Alhaji|Engr\.|\(Dr\.\)|Barr\.|Comrade|Karagama|Late|Sen\.|Dr\.)\s+/g, "").replace(/^(Prof\.|\(Dr\.\))\s+/, "").split(" ").filter(x => /^[A-Z]/.test(x)).slice(0, 2).map(x => x[0]).join("");
}
export function Avatar({ name, src, className = "" }) {
  return src ? <img className={className} src={src} alt="" /> : <div className={`ph ${className}`}>{initials(name || "") || "＋"}</div>;
}
