import "../globals.css";
import "../extra.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import { langOf, tr, LANGS } from "@/lib/i18n";


export const metadata = {
  title: "Damboa Local Government Area – Official Website",
  description: "Official website of Damboa Local Government Area, Borno State, Nigeria: news, leadership, wards, services and how to reach the council.",
};
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0f5132" };
export const dynamicParams = false;
export function generateStaticParams() { return LANGS.map(lang => ({ lang })); }

export default async function RootLayout({ children, params }) {
  const L = await langOf(params); const t = tr(L);
  const nav = [["/", t("home")], ["/about", t("about")], ["/history", t("history")], ["/leadership", t("leaders")], ["/legislators", t("legis")], ["/wards", t("wards")], ["/news", t("news")], ["/humanitarian", t("human")], ["/politics", t("politics")], ["/services", t("contact")]];
  return (
    <html lang={L}>
      <body>
        <Header L={L} nav={nav} stateLine={t("state")} />
        <main>{children}</main>
        <TabBar labels={{ home: t("home"), news: t("news"), wards: t("wardsS"), reps: t("legisS"), more: t("moreT") }} />
        <footer><div className="in">
          <div><b>Damboa Local Government Secretariat</b> · Maiduguri Road, Damboa, Borno State</div>
          <div>{t("managed")}</div>
          <div>{t("tech")}</div>
        </div></footer>
      </body>
    </html>
  );
}
