"use client";
import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import { Field, cleanList } from "./Fields";

export const refreshSite = () => fetch("/api/revalidate", { method: "POST" }).catch(() => {});

export function Editor({ cfg, table, row, onClose, onSaved, profile, inline }) {
  const editing = !!row;
  const [r, setR] = useState(() => row ? { ...row } : { ...(cfg.defaults ? cfg.defaults() : {}) });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const set = k => v => setR(x => ({ ...x, [k]: v }));
  const isOffice = profile.role === "office_admin";
  const fields = cfg.fields.filter(f => !(isOffice && ["office_key", "slug"].includes(f[0])));
  async function save(e) {
    e.preventDefault();
    for (const f of cfg.fields) if (f[3]?.required && (r[f[0]] === undefined || r[f[0]] === null || r[f[0]] === "")) { setErr(`Please fill in “${f[1]}”.`); return; }
    const out = {}; cfg.fields.forEach(([k, , t]) => { if (k in r) out[k] = t === "list" ? cleanList(r[k]) : r[k]; });
    if (table === "news") { out.updated_at = new Date().toISOString(); if (isOffice) out.office_key = profile.office_key; }
    setBusy(true); setErr("");
    const q = editing ? sb().from(table).update(out).eq(cfg.pk, row[cfg.pk]) : sb().from(table).insert(out);
    const { data, error } = await q.select();
    setBusy(false);
    if (error) { setErr(error.message); return; }
    refreshSite();
    const saved = data?.[0];
    if (table === "news" && out.status === "published" && saved?.status === "pending") alert("Saved. This story is waiting for approval before it appears on the site.");
    onSaved(saved);
  }
  async function del() {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setBusy(true);
    const { error } = await sb().from(table).delete().eq(cfg.pk, row[cfg.pk]);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    refreshSite(); onSaved(null, true);
  }
  return <div className={inline ? "" : "asheet"}><form className="asheetin" onSubmit={save}>
    <div className="ahead">{onClose && <button type="button" className="aback" onClick={onClose}>‹ Back</button>}<b>{editing ? "Edit" : "Add"} – {cfg.label}</b></div>
    {fields.map(f => <Field key={f[0]} f={f} value={r[f[0]]} onChange={set(f[0])} editing={editing} />)}
    {err && <div className="aerr">{err}</div>}
    <div className="abar">
      <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
      {editing && !cfg.noAdd && !(isOffice && table === "pages") && <button type="button" className="btn danger" onClick={del} disabled={busy}>Delete</button>}
    </div>
  </form></div>;
}

export default function TableEditor({ cfg, table, profile, filter }) {
  const [rows, setRows] = useState(null); const [edit, setEdit] = useState(undefined); const [q, setQ] = useState(""); const [err, setErr] = useState("");
  async function load() {
    let x = sb().from(table).select("*");
    if (filter) x = filter(x);
    x = x.order(cfg.order[0], { ascending: cfg.order[1], nullsFirst: false });
    const { data, error } = await x.limit(500);
    if (error) setErr(error.message); else setRows(data);
  }
  useEffect(() => { setRows(null); load(); }, [table]); // eslint-disable-line
  const shown = (rows || []).filter(r => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  return <div>
    <div className="atop"><h1>{cfg.icon} {cfg.label}</h1>{!cfg.noAdd && <button className="btn" onClick={() => setEdit(null)}>＋ Add</button>}</div>
    <input className="asearch" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
    {err && <div className="aerr">{err}</div>}
    {!rows ? <p className="note">Loading…</p> : !shown.length ? <p className="empty">Nothing here yet.</p> :
      <div className="alist">{shown.map(r => <button key={r[cfg.pk]} className="arow" onClick={() => setEdit(r)}>
        {(r.photo_url || r.image_url) ? <img src={r.photo_url || r.image_url} alt="" /> : null}
        <div><b>{cfg.title(r)}</b><span>{cfg.sub(r)}</span></div>{r.status && <em className={`st st-${r.status}`}>{r.status}</em>}<i>›</i>
      </button>)}</div>}
    {edit !== undefined && <Editor cfg={cfg} table={table} row={edit} profile={profile} onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); load(); }} />}
  </div>;
}
