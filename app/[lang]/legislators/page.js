import { langOf, tr } from "@/lib/i18n";
import { getSeats, getPhotoMap, getWards } from "@/lib/data";
import { Seats } from "@/components/People";
export const revalidate = 60;
export default async function Legislators({ params }) {
  const L = await langOf(params); const t = tr(L);
  const [seats, photos, wards] = await Promise.all([getSeats(), getPhotoMap(), getWards()]);
  return <>
    <h1>{t("legis")}</h1><p>{L === "ha" ? "Wakilan Damboa a dukkan matakai. Taba kowane kujera don ganin wadanda suka rike ta tun 1999." : "Damboa's representatives at every level. Tap a seat to see everyone who has held it since 1999."}</p>
    <Seats seats={seats} photos={photos} wards={wards} L={L} />
  </>;
}
