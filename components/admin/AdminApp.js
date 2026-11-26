"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { sb, hasSupabase } from "@/lib/supabase";
import Icon from "@/components/Icon";
import { TABLES, ACCESS } from "./config";
import TableEditor from "./TableEditor";
import { Dashboard, Approvals, Messages, Settings, Users, MyPage } from "./Panels";

const LABELS = { dash: ["home", "Dashboard"], approvals: ["wait", "Approvals"], messages: ["inbox", "Messages"], settings: ["settings", "Settings"], users: ["key", "Users"], mypage: ["landmark", "My page"] };
const lab = k => LABELS[k] || [TABLES[k].icon, TABLES[k].label];

function Login() {
  const [mode, setMode] = useState("in"); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); const f = new FormData(e.target); setBusy(true); setMsg("");
    const email = f.get("email"), password = f.get("password");
    let r;
    if (mode === "in") r = await sb().auth.signInWithPassword({ email, password });
    else if (mode === "up") r = await sb().auth.signUp({ email, password, options: { data: { full_name: f.get("name") } } });
    else r = await sb().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin` });
    setBusy(false);
    if (r.error) setMsg(r.error.message);
    else if (mode === "up") setMsg("Account created. Check your email to confirm, then ask the super admin to give you a role.");
    else if (mode === "reset") setMsg("If that email has an account, a reset link is on its way.");
  }
  return <div className="alogin"><div className="card">
    <div className="crest" style={{ margin: "0 auto 8px" }}>D</div>
    <h1 style={{ textAlign: "center", margin: 0 }}>Damboa LGA</h1><p className="note" style={{ textAlign: "center" }}>Content management</p>
    <form onSubmit={go}>
      {mode === "up" && <><label>Full name</label><input name="name" required autoComplete="name" /></>}
      <label>Email</label><input name="email" type="email" required autoComplete="email" />
      {mode !== "reset" && <><label>Password</label><input name="password" type="password" required minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} /></>}
      <button className="btn" style={{ width: "100%", marginTop: 12 }} disabled={busy}>{busy ? "…" : mode === "in" ? "Sign in" : mode === "up" ? "Create staff account" : "Send reset link"}</button>
    </form>
    {msg && <p className="note" style={{ marginTop: 10 }}>{msg}</p>}
    <p className="note" style={{ textAlign: "center", marginTop: 12 }}>
      {mode !== "in" && <a href="#" onClick={e => { e.preventDefault(); setMode("in"); }}>Sign in</a>}
      {mode !== "up" && <> · <a href="#" onClick={e => { e.preventDefault(); setMode("up"); }}>New staff account</a></>}
      {mode !== "reset" && <> · <a href="#" onClick={e => { e.preventDefault(); setMode("reset"); }}>Forgot password</a></>}
    </p>
  </div></div>;
}

function NewPassword({ done }) {
  const [msg, setMsg] = useState("");
  return <div className="alogin"><form className="card" onSubmit={async e => { e.preventDefault(); const { error } = await sb().auth.updateUser({ password: new FormData(e.target).get("p") }); if (error) setMsg(error.message); else done(); }}>
    <h2>Choose a new password</h2><input name="p" type="password" minLength={8} required /><button className="btn" style={{ marginTop: 10 }}>Save password</button>{msg && <p className="aerr">{msg}</p>}</form></div>;
}

export default function AdminApp() {
  const [session, setSession] = useState(undefined); const [profile, setProfile] = useState(null);
  const [view, setView] = useState("dash"); const [menu, setMenu] = useState(false); const [recover, setRecover] = useState(false);
  useEffect(() => {
    if (!hasSupabase) return;
    sb().auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb().auth.onAuthStateChange((ev, s) => { setSession(s); if (ev === "PASSWORD_RECOVERY") setRecover(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setProfile(null); return; }
    sb().from("profiles").select("*").eq("id", session.user.id).single().then(({ data }) => setProfile(data || { id: session.user.id, role: "pending", full_name: session.user.email }));
  }, [session]);

  if (!hasSupabase) return <div className="alogin"><div className="card"><h1>Admin not connected yet</h1><p>The site is running on its built-in sample content. To turn on the admin panel, create the Supabase project and add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel. Steps are in the README.</p><Link className="btn btnlink" href="/">Back to site</Link></div></div>;
  if (session === undefined || (session && !profile)) return <div className="alogin"><p className="note">Loading…</p></div>;
  if (recover) return <NewPassword done={() => setRecover(false)} />;
  if (!session) return <Login />;
  const allowed = ACCESS[profile.role] || [];
  if (!allowed.length) return <div className="alogin"><div className="card"><h2>Waiting for access</h2><p>Your account ({session.user.email}) is set up. The super admin needs to give you a role before you can edit the site.</p><button className="btn ghost" onClick={() => sb().auth.signOut()}>Sign out</button></div></div>;

  const go = k => { setView(k); setMenu(false); window.scrollTo(0, 0); };
  const office = profile.role === "office_admin";
  const body = view === "dash" ? <Dashboard profile={profile} go={go} allowed={allowed} />
    : view === "approvals" ? <Approvals profile={profile} />
    : view === "messages" ? <Messages profile={profile} />
    : view === "settings" ? <Settings />
    : view === "users" ? <Users profile={profile} />
    : view === "mypage" ? <MyPage profile={profile} />
    : TABLES[view] ? <TableEditor key={view} cfg={TABLES[view]} table={view} profile={profile} filter={view === "news" && office ? q => q.eq("office_key", profile.office_key) : null} />
    : null;
  const bottom = ["dash", "news", allowed.includes("approvals") ? "approvals" : "messages"].filter(k => allowed.includes(k));
  return <div className="admin">
    <header className="abarTop"><button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button><b>Damboa LGA · Admin</b><Link href="/" className="note" target="_blank">View site ↗</Link></header>
    <nav className={`anav${menu ? " on" : ""}`}>
      {allowed.map(k => <button key={k} className={view === k ? "on" : ""} onClick={() => go(k)}><span><Icon name={lab(k)[0]} /></span>{lab(k)[1]}</button>)}
      <button onClick={() => sb().auth.signOut()}><span>↩</span>Sign out</button>
    </nav>
    {menu && <div className="ascrim" onClick={() => setMenu(false)} />}
    <div className="amain">{body}</div>
    <div className="atab">{bottom.map(k => <button key={k} className={view === k ? "on" : ""} onClick={() => go(k)}><span><Icon name={lab(k)[0]} /></span>{lab(k)[1]}</button>)}<button onClick={() => setMenu(true)}><span><Icon name="menu" /></span>More</button></div>
  </div>;
}
