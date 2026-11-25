import { getLang, tr } from "@/lib/i18n";
import { getServices, getNews, getPrices, getWards, getOfficials } from "@/lib/data";
import { Services } from "@/components/People";
import ContactForm from "@/components/ContactForm";
export const revalidate = 60;
export default async function ServicesPage() {
  const L = await getLang(); const t = tr(L); const ha = L === "ha";
  const [svcs, news, prices, wards, off] = await Promise.all([getServices(), getNews(), getPrices(), getWards(), getOfficials()]);
  return <>
    <h1>{t("contact")}</h1>
    <p className="note">{ha ? "Taba hidima don ganin bayanai da labarai." : "Tap a service to see its details and latest updates."}</p>
    <Services services={svcs} news={news} prices={prices} L={L} />
    <section className="two"><div><h2>{ha ? "Aiko mana sako" : "Send us a message"}</h2><ContactForm office="lga" wards={wards} L={L} /></div>
      <div><h2>{ha ? "Lambobin ofisoshi" : "Office contacts"}</h2><div className="card"><table className="keep"><tbody>{off.map(o => <tr key={o.id || o.office}><td>{o.office}</td><td>{o.phone ? <a href={`tel:${o.phone}`}>{o.phone}</a> : <span className="note">To be added</span>}</td></tr>)}</tbody></table></div></div></section>
  </>;
}
