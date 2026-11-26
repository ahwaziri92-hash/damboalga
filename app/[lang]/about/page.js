import { langOf, tr } from "@/lib/i18n";
import { getHeritage, getSettings, getWards } from "@/lib/data";
import { Avatar } from "@/components/News";
import Icon, { CAT_ICON } from "@/components/Icon";
export const revalidate = 300;
export default async function About({ params }) {
  const L = await langOf(params); const t = tr(L); const ha = L === "ha";
  const [her, s, wards] = await Promise.all([getHeritage(), getSettings(), getWards()]);
  const pus = wards.reduce((a, w) => a + (w.polling_units || []).length, 0);
  const dh = s.district_head;
  return <>
    <h1>{t("about")}</h1>
    <div className="facts">
      {[["1976", "Created"], ["233,200", "2006 census"], [s.population_est, "2022 estimate"], [String(pus), "Polling units (INEC)"], ["601101", "Postal code (Damboa)"], ["Borno South", "Senatorial district"]].map(f => <div key={f[1]} className="fact"><b>{f[0]}</b><span>{f[1]}</span></div>)}
    </div>
    <section className="two"><div>
      <h2>Our people</h2><p>The original settlers of Damboa are the Marghi people. During a boom in calabash farming, Kanuri traders and farmers came, settled and married into local families, so many Damboa families today share Marghi and Kanuri heritage. The Marghi language is a Chadic language, and Damboa and Mulgwai are among its varieties. Marghi communities are known as farmers who place a high value on education.</p>
      <h2>A centre of agriculture and commerce</h2><p>Damboa has long been a farming and trading hub for southern Borno, known for grains, calabash and gum arabic, with a main market that draws traders from across the region. Part of the Sambisa forest area lies within the LGA.</p>
      <h2>Resilience and recovery</h2><p>Damboa went through very hard years from 2014. Its people stayed, returned and rebuilt. The main market reopened in 2016; schools, a new General Hospital, a Higher Islamic College and an ICT Centre have followed. This website records that recovery, and the work still ahead, for every ward.</p>
    </div><div>
      <div className="card"><h3>Traditional institution</h3><div style={{ display: "flex", gap: 12, alignItems: "center" }}><Avatar name={dh} src={s.photos?.[dh]} /><p style={{ margin: 0 }}><b>{dh}</b><br />District Head of Damboa</p></div><p className="note">Damboa was one of the districts of the Borno Emirate before the Damboa Emirate Council was established. Emirate history to be added with the palace.</p></div>
      <div className="card" style={{ marginTop: 12 }}><h3>Elders’ history project</h3><p className="note">We are recording the origins of Damboa town, founding families and festivals from our elders. Families with photos or documents can share them with the Information Unit.</p></div>
    </div></section>
    <section><h2>{ha ? "Tarihi, wurare da dabi'a" : "Heritage, places and nature"}</h2><div className="grid">
      {her.map(h => <div key={h.id || h.title} className="card heri"><div className="hico"><Icon name={h.icon} size={26} /></div><h3>{h.title}</h3>{h.image_url && <img className="nimgbig" src={h.image_url} alt="" />}<p>{h.body}</p>{h.note && <p className="note">{h.note}</p>}</div>)}
    </div><p className="note">{ha ? "Al'umma za su iya aiko da hotuna da labaran tsofaffin wurare." : "Communities can send photos and stories of historic sites to the Information Unit."}</p></section>
  </>;
}
