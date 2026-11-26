import Link from "next/link";
import { langOf, tr } from "@/lib/i18n";
import { getNews, getSettings, getWards, getPhotoMap } from "@/lib/data";
import { NewsList } from "@/components/News";
export const revalidate = 300;
const daysTo = d => Math.max(0, Math.ceil((new Date(d + "T08:00:00+01:00") - Date.now()) / 864e5));
const fmt = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export default async function Politics({ params }) {
  const L = await langOf(params); const t = tr(L); const ha = L === "ha";
  const [news, s, wards, photos] = await Promise.all([getNews(), getSettings(), getWards(), getPhotoMap()]);
  const pus = wards.reduce((a, w) => a + w.polling_units.length, 0);
  const el = s.elections || [];
  return <>
    <h1>{t("politics")}</h1>
    <div className="kpis">
      <div className="kpi"><b>{s.registered_parties}</b><span>{ha ? "Jam'iyyun da INEC ta yi wa rajista" : "Registered political parties (INEC)"}</span></div>
      {el.map(e => <div key={e[0]} className="kpi"><b>{daysTo(e[0])}</b><span>{ha ? "Kwanaki zuwa zabe" : "Days to"} {e[1]}</span></div>)}
      <div className="kpi alt"><b>{pus}</b><span>{ha ? "Rumfunan zabe a Damboa" : "Polling units in Damboa"}</span></div>
    </div>
    <section><h2>{ha ? "Masu rike da mukamai" : "Who holds office now"}</h2>
      <table><tbody><tr><th>Office</th><th>Incumbent</th><th>Party</th></tr>{(s.incumbents || []).map(r => <tr key={r[0]}><td>{r[0]}</td><td><b>{r[1]}</b></td><td>{r[2]}</td></tr>)}</tbody></table></section>
    <div className="card" style={{ marginTop: 20 }}><p style={{ margin: 0 }}><b>{ha ? "Manufar wannan shafi" : "Page policy"}:</b> {ha ? "Wannan shafi a bude yake ga dukkan jam'iyyun da aka yi wa rajista. Ana kara jam'iyyu da abubuwa da amincewar Shugaban Karamar Hukuma." : "This page is open to all registered political parties. Parties and events are added with the Executive Chairman's approval, so that the council's site stays fair to all."}</p></div>
    <section><h2>{ha ? "Labaran siyasa" : "Political news"}</h2><NewsList items={news.filter(n => n.category === "Politics")} photos={photos} L={L} /></section>
    <section><h2>{ha ? "Muhimman ranaku" : "Key election dates"}</h2><table><tbody><tr><th>Date</th><th>Election</th></tr>{el.map(e => <tr key={e[0]}><td>{fmt(e[0])}</td><td>{e[1]}</td></tr>)}</tbody></table>
      <p className="note">Source: INEC timetable. Find your polling unit on the <Link href="/wards">{t("wards")}</Link> page.</p></section>
    <section><h2>{ha ? "Abubuwan da ke tafe" : "Upcoming events"}</h2><p className="note">Campaign events, rallies and town halls approved for publication will appear here.</p></section>
  </>;
}
