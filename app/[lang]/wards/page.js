import { langOf, tr } from "@/lib/i18n";
import { getWards } from "@/lib/data";
import WardMap from "@/components/WardMap";
export const revalidate = 300;
export default async function Wards({ params }) {
  const L = await langOf(params); const t = tr(L);
  const wards = await getWards();
  const total = wards.reduce((a, w) => a + w.polling_units.length, 0);
  return <>
    <h1>{t("wards")}</h1><p className="note">{L === "ha" ? "Taba mazaba a taswira." : "Tap a ward on the map to see its councillor, villages and polling units."}</p>
    <WardMap wards={wards} L={L} />
    <p className="note">Ward boundaries and settlements: GRID3 Nigeria (2026). Polling units: INEC register ({total} units).</p>
    <section><h2>{L === "ha" ? "Duk mazabu" : "All wards"}</h2><table className="keep wt"><tbody><tr><th>#</th><th>Ward</th><th>Polling units</th><th>Councillor</th></tr>
      {wards.map(w => <tr key={w.n}><td>{w.n}</td><td>{w.name}</td><td>{w.polling_units.length}</td><td className="note">{w.councillor || "To be added"}</td></tr>)}
      <tr><th></th><th>Total</th><th>{total}</th><th></th></tr></tbody></table></section>
  </>;
}
