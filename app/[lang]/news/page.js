import { Suspense } from "react";
import { langOf, tr } from "@/lib/i18n";
import { getNews, getPhotoMap } from "@/lib/data";
import NewsBrowser from "@/components/NewsBrowser";
export const revalidate = 60;
export default async function News({ params }) {
  const L = await langOf(params); const t = tr(L); const ha = L === "ha";
  const [all, photos] = await Promise.all([getNews(), getPhotoMap()]);
  const news = all.filter(n => n.category !== "History");
  return <>
    <h1>{t("news")}</h1>
    <Suspense fallback={null}><NewsBrowser all={news} photos={photos} L={L} /></Suspense>
    <p className="note">{ha ? "Sashen Yada Labarai ne ke wallafa labarai." : "Stories are published by the LGA Information Unit."}</p>
  </>;
}
