"use client";
import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import { SETTINGS, OFFICES, TABLES } from "./config";
import { Field } from "./Fields";
import { Editor, refreshSite } from "./TableEditor";

const ago = d => { const s = (Date.now() - new Date(d)) / 1000; return s < 3600 ? `${Math.max(1, Math.round(s / 60))} min ago` : s < 86400 ? `${Math.round(s / 3600)} h ago` : new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };

export function Dashboard({ profile, go, allowed }) {
  const [c, setC] = useState({});
  useEffect(() => { (async () => {
    const n = async (t, f) => { let q = sb().from(t).select("*", { count: "exact", head: true }); if (f) q = f(q); const { count } = await q; return count ?? 0; };
    const off = profile.role === "office_admin" ? q => q.eq("office_key", profile.office_key) : null;
    setC({ pub: await n("news", q => (off ? off(q) : q).eq("status", "published")), pend: await n("news", q => (off ? off(q) : q).eq("status", "pending")), draft: await n("news", q => (off ? off(q) : q).eq("status", "draft")), msg: allowed.includes("messages") ? await n("messages", q => (off ? off(q) : q).eq("status", "new")) : 0 });
  })(); }, []); // eslint-disable-line
  const tiles = [["news", "📰", "Published stories", c.pub], ["approvals", "⏳", "Waiting for approval", c.pend], ["news", "📝", "Drafts", c.draft], ["messages", "✉️", "New messages", c.msg]].filter(t => allowed.includes(t[0]));
  return <div>
    <h1>Salam, {profile.full_name?.split(" ")[0] || "welcome"}</h1>
    <p className="note">Role: <b>{profile.role.replace("_", " ")}</b>{profile.office_key ? ` · ${profile.office_key}` : ""}</p>
    <div className="atiles">{tiles.map((t, i) => <button key={i} className="atile" onClick={() => go(t[0])}><span>{t[1]}</span><b>{t[3] ?? "…"}</b><small>{t[2]}</small></button>)}</div>
    {allowed.includes("news") && <button className="btn" style={{ width: "100%", marginTop: 12 }} onClick={() => go("news", { add: true })}>＋ Write a news story</button>}
    <div className="card" style={{ marginTop: 16 }}><b>Tips</b><ul className="note" style={{ paddingLeft: 18, margin: ".4em 0 0" }}>
      <li>Changes show on the public site within a minute.</li>
      <li>Political stories and stories from office accounts wait for approval by the Chairman’s approver.</li>
      <li>To tag a person in a story, type their name exactly as on their profile.</li>
      <li>For long videos, upload to YouTube and paste the link.</li></ul></div>
  </div>;
}

export function Approvals({ profile }) {
  const [rows, setRows] = useState(null); const [edit, setEdit] = useState(undefined);
  const load = async () => { const { data } = await sb().from("news").select("*").eq("status", "pending").order("updated_at", { ascending: false }); setRows(data || []); };
  useEffect(() => { load(); }, []);
  async function act(r, status) {
    const { error } = await sb().from("news").update({ status, updated_at: new Date().toISOString() }).eq("id", r.id);
    if (error) alert(error.message); else { refreshSite(); load(); }
  }
  return <div><h1>⏳ Approvals</h1><p className="note">Stories waiting for the Chairman’s approval. Political stories and stories sent by office accounts come here.</p>
    {!rows ? <p className="note">Loading…</p> : !rows.length ? <p className="empty">Nothing waiting. All clear.</p> :
      rows.map(r => <div key={r.id} className="card appr">
        {r.image_url && <img src={r.image_url} alt="" />}
        <div className="note">{r.category} · {r.date_label}{r.office_key ? ` · from ${r.office_key}` : ""}</div>
        <h3 style={{ margin: ".2em 0" }}>{r.title}</h3><p style={{ whiteSpace: "pre-wrap" }}>{r.body}</p>
        {r.video_url && <p className="note">🎬 {r.video_url}</p>}
        <div className="abar"><button className="btn" onClick={() => act(r, "published")}>✓ Approve and publish</button><button className="btn ghost" onClick={() => setEdit(r)}>Edit</button><button className="btn ghost" onClick={() => act(r, "draft")}>Send back to draft</button></div>
      </div>)}
    {edit !== undefined && <Editor cfg={TABLES.news} table="news" row={edit} profile={profile} onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); load(); }} />}
  </div>;
}

export function Messages({ profile }) {
  const [rows, setRows] = useState(null); const [f, setF] = useState("new"); const [open, setOpen] = useState(null);
  const load = async () => { let q = sb().from("messages").select("*").order("created_at", { ascending: false }).limit(300); if (profile.role === "office_admin") q = q.eq("office_key", profile.office_key); const { data } = await q; setRows(data || []); };
  useEffect(() => { load(); }, []); // eslint-disable-line
  async function setStatus(r, status) { await sb().from("messages").update({ status }).eq("id", r.id); setRows(x => x.map(y => y.id === r.id ? { ...y, status } : y)); }
  const shown = (rows || []).filter(r => f === "all" || r.status === f);
  const offName = k => (OFFICES.find(o => o[0] === k) || [k, k])[1];
  return <div><h1>✉️ Messages</h1>
    <div className="tabs">{[["new", "New"], ["read", "Read"], ["replied", "Replied"], ["closed", "Closed"], ["all", "All"]].map(t => <button key={t[0]} className={f === t[0] ? "on" : ""} onClick={() => setF(t[0])}>{t[1]}{rows ? ` (${t[0] === "all" ? rows.length : rows.filter(r => r.status === t[0]).length})` : ""}</button>)}</div>
    {!rows ? <p className="note">Loading…</p> : !shown.length ? <p className="empty">No messages.</p> :
      <div className="alist">{shown.map(r => <div key={r.id} className={`card amsg${open === r.id ? " open" : ""}`} onClick={() => { setOpen(open === r.id ? null : r.id); if (r.status === "new") setStatus(r, "read"); }}>
        <div className="note">{ago(r.created_at)} · to {offName(r.office_key)} · {r.topic}</div>
        <b>{r.name || "No name"}</b> <span className="note">{r.ward || ""}{r.village ? ` – ${r.village}` : ""}</span>
        <p style={{ margin: ".3em 0", whiteSpace: open === r.id ? "pre-wrap" : "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.body}</p>
        {open === r.id && <div className="abar" onClick={e => e.stopPropagation()}>
          {r.phone && <a className="btn btnlink" href={`tel:${r.phone}`}>📞 Call</a>}
          {r.phone && <a className="btn btnlink ghost" href={`https://wa.me/${r.phone.replace(/\D/g, "").replace(/^0/, "234")}`} target="_blank" rel="noopener">WhatsApp</a>}
          <button className="btn ghost" onClick={() => setStatus(r, "replied")}>Mark replied</button>
          <button className="btn ghost" onClick={() => setStatus(r, "closed")}>Close</button>
        </div>}
      </div>)}</div>}
  </div>;
}

export function Settings() {
  const [s, setS] = useState(null); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  useEffect(() => { (async () => { const { data } = await sb().from("settings").select("*"); const m = {}; (data || []).forEach(r => { m[r.key] = r.value; }); setS(m); })(); }, []);
  async function save() {
    setBusy(true); setMsg("");
    const rows = SETTINGS.map(([k]) => ({ key: k, value: s[k] ?? null }));
    const { error } = await sb().from("settings").upsert(rows);
    setBusy(false); setMsg(error ? error.message : "Saved."); if (!error) refreshSite();
  }
  if (!s) return <p className="note">Loading…</p>;
  return <div><h1>⚙️ Site settings</h1>
    {SETTINGS.map(f => <Field key={f[0]} f={f} value={s[f[0]]} onChange={v => setS(x => ({ ...x, [f[0]]: v }))} />)}
    <div className="abar"><button className="btn" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>{msg && <span className="note">{msg}</span>}</div>
  </div>;
}

export function Users({ profile }) {
  const [rows, setRows] = useState(null);
  const load = async () => { const { data } = await sb().from("profiles").select("*").order("created_at"); setRows(data || []); };
  useEffect(() => { load(); }, []);
  async function upd(r, patch) { const { error } = await sb().from("profiles").update(patch).eq("id", r.id); if (error) alert(error.message); else load(); }
  return <div><h1>🔑 Users and roles</h1>
    <p className="note">New staff sign up on the admin login page, then appear here as “pending”. Give them a role:</p>
    <ul className="note" style={{ paddingLeft: 18 }}><li><b>Super admin</b> – everything, including users.</li><li><b>Editor</b> – Information Unit: all content and messages.</li><li><b>Approver</b> – approves political and office stories for the Chairman.</li><li><b>Office admin</b> – one office (e.g. the Assembly member): its own page, news and messages. Its stories need approval.</li></ul>
    {!rows ? <p className="note">Loading…</p> : rows.map(r => <div key={r.id} className="card auser">
      <b>{r.full_name || r.id.slice(0, 8)}</b>{r.id === profile.id && <span className="note"> (you)</span>}
      <div className="uplrow">
        <select value={r.role} disabled={r.id === profile.id} onChange={e => upd(r, { role: e.target.value })}>{["pending", "editor", "approver", "office_admin", "super_admin"].map(x => <option key={x} value={x}>{x.replace("_", " ")}</option>)}</select>
        {r.role === "office_admin" && <select value={r.office_key || ""} onChange={e => upd(r, { office_key: e.target.value || null })}><option value="">Choose office</option>{OFFICES.map(o => <option key={o[0]} value={o[0]}>{o[1]}</option>)}</select>}
      </div></div>)}
  </div>;
}

export function MyPage({ profile }) {
  const [row, setRow] = useState(undefined);
  useEffect(() => { (async () => { const { data } = await sb().from("pages").select("*").eq("office_key", profile.office_key).limit(1); setRow(data?.[0] || null); })(); }, []); // eslint-disable-line
  if (row === undefined) return <p className="note">Loading…</p>;
  if (!row) return <p className="empty">No page is set up for your office yet. Ask the Information Unit to create it.</p>;
  return <Editor cfg={TABLES.pages} table="pages" row={row} profile={profile} onClose={null} inline onSaved={r => { if (r) setRow(r); alert("Saved."); }} />;
}
