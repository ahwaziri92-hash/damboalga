"use client";
import { useState } from "react";
import { sb, hasSupabase } from "@/lib/supabase";

export default function ContactForm({ office = "lga", wards = [], topics = ["Roads", "Water", "Education", "Health", "Security", "Markets", "Other"], L = "en", needs }) {
  const [ward, setWard] = useState("");
  const [state, setState] = useState("idle");
  const w = wards.find(x => String(x.n) === ward);
  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const row = { office_key: office, name: f.get("name"), phone: f.get("phone"), ward: w?.name || null, village: f.get("village"), topic: f.get("topic"), body: f.get("body") };
    if (!row.body) return;
    setState("sending");
    if (!hasSupabase) { setState("demo"); return; }
    const { error } = await sb().from("messages").insert(row);
    setState(error ? "error" : "sent"); if (!error) e.target.reset();
  }
  return (
    <form className="card" onSubmit={submit}>
      <label>{L === "ha" ? "Suna" : "Name"}</label><input name="name" />
      <label>{L === "ha" ? "Lambar waya" : "Phone"}</label><input name="phone" inputMode="tel" />
      {wards.length > 0 && <>
        <label>{L === "ha" ? "Mazaba" : "Ward"}</label>
        <select value={ward} onChange={e => setWard(e.target.value)}><option value="">{L === "ha" ? "Zabi mazabarka" : "Choose your ward"}</option>{wards.map(x => <option key={x.n} value={x.n}>{x.name}</option>)}</select>
        <label>{L === "ha" ? "Kauye / rumfar zabe" : "Village / polling unit"}</label>
        <select name="village" disabled={!w}>{w ? w.polling_units.map(p => <option key={p}>{p}</option>) : <option>{L === "ha" ? "Zabi mazaba tukuna" : "Choose a ward first"}</option>}</select>
      </>}
      {needs ? <><label>{L === "ha" ? "Irin bukata" : "Type of need"}</label><select name="topic">{needs.map(x => <option key={x}>{x}</option>)}</select></>
        : <><label>{L === "ha" ? "Batun" : "Topic"}</label><select name="topic">{topics.map(x => <option key={x}>{x}</option>)}</select></>}
      <label>{L === "ha" ? "Sako" : "Message"}</label><textarea name="body" rows={4} required />
      <button className="btn" disabled={state === "sending"}>{state === "sending" ? "…" : (L === "ha" ? "Aika" : "Send")}</button>
      {state === "sent" && <div className="ok" style={{ display: "block" }}>{L === "ha" ? "Mun gode. An aika sakonka zuwa ofishin." : "Thank you. Your message has been sent to the office."}</div>}
      {state === "demo" && <div className="ok" style={{ display: "block" }}>{L === "ha" ? "Mun gode. (Samfuri: za a fara isar da sakonni da zarar an kunna tsarin karamar hukuma.)" : "Thank you. (Preview: messages will start reaching the office once the council’s system is switched on.)"}</div>}
      {state === "error" && <div className="ok" style={{ display: "block", background: "#fde8e8", color: "#8a1c1c" }}>Sorry, the message could not be sent. Please try again.</div>}
    </form>
  );
}
