import Link from "next/link";
import { langOf, tr } from "@/lib/i18n";
import { getNews, getSettings, getWards, getPhotoMap, getPage } from "@/lib/data";
import { NewsList } from "@/components/News";
import { HomeMap } from "@/components/WardMap";
import Icon, { CAT_ICON } from "@/components/Icon";

export const revalidate = 60;
export default async function Home({ params }) {
  const L = await langOf(params); const t = tr(L); const ha = L === "ha";
  const [news, s, wards, photos, chair] = await Promise.all([getNews(), getSettings(), getWards(), getPhotoMap(), getPage("chairman")]);
  const pus = wards.reduce((a, w) => a + (w.polling_units || []).length, 0);
  const quick = [["/legislators", "landmark", ha ? "Tuntubi dan majalisarka" : "Contact your legislator"], ["/humanitarian", "help", ha ? "Bayar da rahoton bukata" : "Report a need"], ["/history", "scroll", ha ? "Taskar tarihin Damboa" : "Damboa history archive"], ["/news", "news", ha ? "Sabbin labarai" : "Latest news"], ["/leadership", "users", ha ? "Shugabannin da suka gabata da na yanzu" : "Past and present leaders"], ["/services", "pin", ha ? "Ofisoshi da hidimomi" : "Offices and services"]];
  return <>
    <div className="hero"><div><h1>{t("heroT")}</h1><p>{ha ? s.hero_ha : s.hero_en}</p></div>
      <div className="facts" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        <div className="fact"><b>{wards.length}</b><span>{ha ? "Mazabu" : "Political wards"}</span></div>
        <div className="fact"><b>{pus}</b><span>{ha ? "Rumfunan zabe" : "Polling units"}</span></div>
        <div className="fact"><b>{s.population_est}</b><span>{ha ? "Kiyasin jama'a (2022)" : "Est. population (2022)"}</span></div>
        <div className="fact"><b>{s.land_area}</b><span>{ha ? "Fadin kasa" : "Land area"}</span></div>
      </div></div>
    <div className="leaders">{(s.leaders || []).map(x => <div key={x.name} className="ldr">{x.photo_url && <img src={x.photo_url} alt="" />}<div><div className="note">{x.role}</div><b>{x.name}</b></div></div>)}</div>
    {chair && <div className="welcome">{chair.photo_url && <img src={chair.photo_url} alt={chair.name} />}
      <div><h2 style={{ marginBottom: ".2em" }}>{t("welT")}</h2><p>{ha ? s.welcome_ha : s.welcome_en}</p><b>{chair.name}</b><br /><span className="note">{chair.role}, {chair.subtitle}</span><br />
        <Link className="btn btnlink" href="/chairman">{t("chairPage")} →</Link></div></div>}
    <section className="two"><div><h2>{t("mapT")}</h2><HomeMap wards={wards} /><p className="note">{ha ? "Iyakokin mazabu daga GRID3 (2026)." : "Ward boundaries from GRID3 (2026)."} <Link href="/wards">{t("wards")} →</Link></p></div>
      <div><h2>{t("quick")}</h2><div className="grid quick" style={{ gridTemplateColumns: "1fr" }}>
        {quick.map(q => <div key={q[0]} className="card"><Link href={q[0]}><span className="ico"><Icon name={q[1]} /></span>{q[2]}</Link></div>)}</div></div></section>
    <section><h2>{t("latest")}</h2><NewsList items={news.slice(0, 3)} photos={photos} L={L} /><p><Link className="back" href="/news">{t("all")} →</Link></p></section>
  </>;
}
