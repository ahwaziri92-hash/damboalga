import { notFound } from "next/navigation";
import { langOf, tr } from "@/lib/i18n";
import { getPage, getNews, getPhotoMap, getWards } from "@/lib/data";
import OfficePage from "@/components/OfficePage";
export const revalidate = 60;
export async function generateStaticParams() { const { getPages } = await import("@/lib/data"); return (await getPages()).filter(p => p.slug !== "chairman").map(p => ({ slug: p.slug })); }
export default async function Legislator({ params }) {
  const { slug } = await params;
  const L = await langOf(params); const t = tr(L);
  const [p, news, photos, wards] = await Promise.all([getPage(slug), getNews(), getPhotoMap(), getWards()]);
  if (!p || slug === "chairman") notFound();
  return <OfficePage p={p} news={news} photos={photos} wards={wards} L={L} back={["/legislators", t("legis")]} />;
}
