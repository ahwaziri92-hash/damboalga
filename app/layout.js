import "./globals.css";
import "./extra.css";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import { getLang, tr } from "@/lib/i18n";

export const metadata = {
  title: "Damboa Local Government Area – Official Website",
  description: "Official website of Damboa Local Government Area, Borno State, Nigeria: news, leadership, wards, services and how to reach the council.",
};
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0f5132" };

export default async function RootLayout({ children }) {
  const L = await getLang(); const t = tr(L);
  const nav = [["/", t("home")], ["/about", t("about")], ["/leadership", t("leaders")], ["/legislators", t("legis")], ["/wards", t("wards")], ["/news", t("news")], ["/humanitarian", t("human")], ["/politics", t("politics")], ["/services", t("contact")]];
  return (
    <html lang={L}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
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
