import { notFound } from "next/navigation";
import { langOf, tr } from "@/lib/i18n";
import { getPage, getNews, getPhotoMap, getWards } from "@/lib/data";
import OfficePage from "@/components/OfficePage";
export const revalidate = 60;
export default async function Chairman({ params }) {
  const L = await langOf(params); const t = tr(L);
  const [p, news, photos, wards] = await Promise.all([getPage("chairman"), getNews(), getPhotoMap(), getWards()]);
  if (!p) notFound();
  return <OfficePage p={p} news={news} photos={photos} wards={wards} L={L} back={["/leadership", t("leaders")]} />;
}
