import { langOf, tr } from "@/lib/i18n";
import { getPartners, getNews, getWards, getPhotoMap } from "@/lib/data";
import { NewsList } from "@/components/News";
import ContactForm from "@/components/ContactForm";
export const revalidate = 60;
export default async function Humanitarian({ params }) {
  const L = await langOf(params); const t = tr(L); const ha = L === "ha";
  const [parts, news, wards, photos] = await Promise.all([getPartners(), getNews(), getWards(), getPhotoMap()]);
  const jobs = news.filter(n => ["Humanitarian", "Jobs"].includes(n.category));
  const openJobs = jobs.filter(n => n.category === "Jobs").length;
  return <>
    <h1>{t("human")}</h1>
    <p>{ha ? "Bayanai kan hidimomi, abokan aiki da yadda za a nemi taimako a Damboa." : "Services, partners and how to get help in Damboa. Figures are dated and come from official humanitarian sources."}</p>
    <div className="kpis">
      <div className="kpi"><b>{parts.length}</b><span>{ha ? "Abokan aiki a Damboa" : "Partners working in Damboa"}</span></div>
      <div className="kpi"><b>2</b><span>{ha ? "Asibitocin kyauta" : "Free clinics (GTS, Hausari)"}</span></div>
      <div className="kpi alt"><b>~20,800</b><span>{ha ? "'Yan gudun hijira a garin Damboa (2019)" : "IDPs in Damboa town (REACH/IOM, 2019)"}</span></div>
      <div className="kpi alt"><b>{openJobs}</b><span>{ha ? "Damar aiki a bude" : "Open opportunities"}</span></div>
    </div>
    <section className="two"><div><h2>{ha ? "Hidimomi da abokan aiki" : "Services and partners"}</h2><div className="grid" style={{ gridTemplateColumns: "1fr" }}>
      {parts.map(p => <div key={p.id || p.name} className="card"><h3>{p.name}</h3><p>{p.description}</p></div>)}</div></div>
      <div><h2>{ha ? "Bayar da rahoton bukata" : "Report a need"}</h2><ContactForm office="humanitarian" wards={wards} L={L} needs={["Food", "Health", "Shelter", "Water and sanitation", "Protection", "Other"]} /></div></section>
    <section><h2>{ha ? "Damar aiki da labaran agaji" : "Jobs, opportunities and updates"}</h2><p className="note">{ha ? "Abokan aiki na wallafa guraben aiki da shirye-shirye a nan." : "Partners post vacancies, distributions and programme updates here, as news."}</p>
      {jobs.length ? <NewsList items={jobs} photos={photos} L={L} /> : <p className="empty">{ha ? "Babu tukuna." : "No openings posted right now."}</p>}</section>
  </>;
}
