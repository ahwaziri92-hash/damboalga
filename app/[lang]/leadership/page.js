import Link from "next/link";
import { langOf, tr } from "@/lib/i18n";
import { getChairmen, getOfficials, getStakeholders, getNews, getPhotoMap, getSettings } from "@/lib/data";
import { ChairmenTimeline, Stakeholders } from "@/components/People";
import { Avatar } from "@/components/News";
export const revalidate = 60;
export default async function Leadership({ params }) {
  const L = await langOf(params); const t = tr(L); const ha = L === "ha";
  const [ch, off, sk, news, photos, s] = await Promise.all([getChairmen(), getOfficials(), getStakeholders(), getNews(), getPhotoMap(), getSettings()]);
  return <>
    <h1>{t("leaders")}</h1><p className="note">{ha ? "Taba suna don ganin takaitaccen tarihinsa." : "Tap a name to read a short biography. Dates marked 'to confirm' will be checked against council records."}</p>
    <section className="two"><div><h2>{ha ? "Shugabannin Karamar Hukuma" : "Chairmen of Damboa LGA"}</h2><ChairmenTimeline chairmen={ch} L={L} /></div>
      <div><h2>{ha ? "Majalisar zartarwa" : "Current council"}</h2>
        <div className="card"><table><tbody><tr><th>Office</th><th>Holder</th></tr>
          {off.map(o => <tr key={o.id || o.office}><td>{o.office}</td><td>{o.name ? (o.office === "Executive Chairman" ? <Link href="/chairman">{o.name}</Link> : o.name) : <span className="note">To be added</span>}</td></tr>)}
          <tr><td>Councillors (10 wards)</td><td><Link href="/wards">See wards</Link></td></tr></tbody></table></div>
        <h2 style={{ marginTop: 20 }}>{ha ? "Masarauta" : "Traditional leadership"}</h2>
        <div className="card"><div className="person"><Avatar name={s.district_head} src={photos[s.district_head]} /><div><div className="yrs">Current</div><h3 style={{ margin: ".1em 0" }}>{s.district_head}</h3><div className="note">District Head of Damboa</div></div></div></div>
      </div></section>
    <section id="stake"><h2>{ha ? "Manyan masu ruwa da tsaki" : "Key stakeholders"}</h2>
      <p className="note">{ha ? "Taba suna don ganin tarihinsa." : "The people who shape Damboa beyond elected office. Tap a name to see their story."}</p>
      {sk.length ? <Stakeholders groups={sk} news={news} photos={photos} L={L} /> : <p className="note">To be added.</p>}</section>
  </>;
}
