import Link from "next/link";
import { langOf, tr } from "@/lib/i18n";
import { getNews, getWards } from "@/lib/data";
import ContactForm from "@/components/ContactForm";
import HistoryList from "@/components/HistoryList";
export const revalidate = 300;
export default async function History({ params }) {
  const L = await langOf(params); const t = tr(L); const ha = L === "ha";
  const [news, wards] = await Promise.all([getNews(), getWards()]);
  // History stories, plus any older council story, oldest first
  const items = news.filter(n => n.category === "History" || (n.sort_date && n.sort_date < "2018-01-01"))
    .sort((a, b) => String(a.sort_date || "").localeCompare(String(b.sort_date || "")));
  return <>
    <h1>{t("history")}</h1>
    <p>{ha ? "Labarin Damboa daga tushe zuwa yau: mutanenmu, sana'o'inmu, wahalhalun da muka sha, da yadda muka sake gini." : "The story of Damboa from its roots to today: our people, our trades, the hard years and how we rebuilt. Each story shows where it comes from."}</p>
    <HistoryList items={items} L={L} />
    <section className="two"><div>
      <h2>{ha ? "Aiko da labarin tarihi" : "Share a story with the archive"}</h2>
      <p className="note">{ha ? "Kana da labari, hoto ko takarda game da tarihin Damboa? Aiko mana. Sashen Yada Labarai zai tuntube ka." : "Do you remember how your village was founded, a festival, a craft, or a leader from the past? Do you have old photos or documents? Send us a short note and the Information Unit will contact you to record it."}</p>
      <ContactForm office="lga" wards={wards} L={L} topics={["History story", "Old photos or documents", "Correction to a story"]} />
    </div><div>
      <div className="card"><h3>{ha ? "Shirin tarihin dattawa" : "Elders’ history project"}</h3><p className="note">{ha ? "Muna rubuta asalin garin Damboa, iyalan da suka kafa shi da bukukuwa daga bakin dattawanmu." : "We are recording the origins of Damboa town, founding families, festivals and crafts from our elders, in Marghi, Kanuri, Hausa and English. Recorded interviews will be added here as video."}</p></div>
      <div className="card" style={{ marginTop: 12 }}><h3>{ha ? "Wurare da dabi'a" : "Heritage and places"}</h3><p className="note">{ha ? "Duba wuraren tarihi a shafin Game da Damboa." : "See historic places, Sambisa Forest and the calabash trade on the About page."}</p><Link className="btn btnlink" href="/about">{t("about")} →</Link></div>
    </div></section>
  </>;
}
