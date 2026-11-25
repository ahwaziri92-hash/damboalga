"use client";
import { useState } from "react";
import { sb } from "@/lib/supabase";

async function upload(file, folder) {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb().storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return sb().storage.from("media").getPublicUrl(path).data.publicUrl;
}

function Upload({ value, onChange, kind }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function pick(e) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > (kind === "video" ? 50 : 8) * 1024 * 1024) { setErr(kind === "video" ? "Videos must be under 50 MB. For longer videos, upload to YouTube and paste the link." : "Photos must be under 8 MB."); return; }
    setBusy(true); setErr("");
    try { onChange(await upload(f, kind === "video" ? "videos" : "photos")); } catch (x) { setErr(x.message); }
    setBusy(false);
  }
  return <div className="upl">
    {value && kind === "image" && <img src={value} alt="" />}
    <input type="text" value={value || ""} placeholder={kind === "video" ? "Paste a YouTube link, or upload below" : "Photo link, or upload below"} onChange={e => onChange(e.target.value || null)} />
    <div className="uplrow">
      <label className="btn ghost">{busy ? "Uploading…" : kind === "video" ? "Upload video" : "Take or choose photo"}<input type="file" accept={kind === "video" ? "video/*" : "image/*"} hidden onChange={pick} disabled={busy} /></label>
      {value && <button type="button" className="btn ghost" onClick={() => onChange(null)}>Remove</button>}
    </div>
    {err && <div className="aerr">{err}</div>}
  </div>;
}

export function Field({ f, value, onChange, editing }) {
  const [name, label, type, o = {}] = f;
  const lock = o.lockOnEdit && editing;
  let input;
  if (type === "textarea") input = <textarea rows={o.rows || 4} value={value || ""} onChange={e => onChange(e.target.value)} />;
  else if (type === "number") input = <input type="number" inputMode="numeric" value={value ?? ""} disabled={lock} onChange={e => onChange(e.target.value === "" ? null : Number(e.target.value))} />;
  else if (type === "date") input = <input type="date" value={value || ""} onChange={e => onChange(e.target.value || null)} />;
  else if (type === "bool") return <label className="chk"><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} /> {label}</label>;
  else if (type === "select") input = <select value={value ?? ""} onChange={e => onChange(e.target.value || null)}>{o.blank && <option value="">—</option>}{o.options.map(x => Array.isArray(x) ? <option key={x[0]} value={x[0]}>{x[1]}</option> : <option key={x}>{x}</option>)}</select>;
  else if (type === "list") input = <textarea rows={Math.min(10, Math.max(3, (value || []).length + 1))} value={(value || []).join("\n")} onChange={e => onChange(e.target.value.split("\n").map(s => s.replace(/\s+$/, "")).filter((s, i, a) => s || i === a.length - 1))} />;
  else if (type === "json") return <JsonField label={label} value={value} onChange={onChange} />;
  else if (type === "image" || type === "video") input = <Upload value={value} onChange={onChange} kind={type} />;
  else input = <input type="text" value={value ?? ""} disabled={lock} onChange={e => onChange(e.target.value)} />;
  return <div className="af"><label>{label}{o.required && " *"}</label>{input}</div>;
}

function JsonField({ label, value, onChange }) {
  const [txt, setTxt] = useState(() => JSON.stringify(value ?? [], null, 2));
  const [bad, setBad] = useState(false);
  return <div className="af"><label>{label}</label>
    <textarea rows={8} style={{ fontFamily: "monospace", fontSize: 13 }} value={txt} onChange={e => { setTxt(e.target.value); try { onChange(JSON.parse(e.target.value)); setBad(false); } catch { setBad(true); } }} />
    {bad && <div className="aerr">Not valid yet – check commas and quotes.</div>}</div>;
}
export const cleanList = v => Array.isArray(v) ? v.map(s => String(s).trim()).filter(Boolean) : v;
