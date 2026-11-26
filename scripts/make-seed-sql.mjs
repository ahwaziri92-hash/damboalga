// Generates supabase/seed.sql from lib/seed.json
import fs from "fs";
const S = JSON.parse(fs.readFileSync(new URL("../lib/seed.json", import.meta.url), "utf8"));
const q = v => v === null || v === undefined ? "null"
  : typeof v === "boolean" ? (v ? "true" : "false")
  : typeof v === "number" ? String(v)
  : Array.isArray(v) && v.every(x => typeof x === "string") ? `array[${v.map(q).join(",")}]::text[]`
  : typeof v === "object" ? `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`
  : `'${String(v).replace(/'/g, "''")}'`;
const JSONB = new Set(["sources", "updates", "candidate"]);
const val = (k, v) => JSONB.has(k) && v !== null && v !== undefined ? `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb` : q(v);
const ins = (table, rows) => rows.map(r => `insert into ${table} (${Object.keys(r).join(",")}) values (${Object.entries(r).map(([k, v]) => val(k, v)).join(",")});`).join("\n");
let out = "-- Seed content for the Damboa LGA website (generated)\n";
out += ins("news", S.news) + "\n";
out += ins("chairmen", S.chairmen) + "\n";
out += ins("seats", S.seats) + "\n";
out += ins("seat_holders", S.holders) + "\n";
out += ins("stakeholders", S.stakeholders) + "\n";
out += ins("wards", S.wards) + "\n";
out += ins("services", S.services) + "\n";
out += ins("market_prices", S.prices) + "\n";
out += ins("partners", S.partners) + "\n";
out += ins("heritage", S.heritage) + "\n";
out += ins("officials", S.officials) + "\n";
out += ins("pages", S.pages) + "\n";
out += Object.entries(S.settings).map(([k, v]) => `insert into settings (key,value) values (${q(k)},${q(JSON.stringify(v)).replace("::text[]", "")}::jsonb) on conflict (key) do update set value = excluded.value;`).join("\n") + "\n";
out += `insert into settings (key,value) values ('photos', ${q(JSON.stringify(S.photos))}::jsonb) on conflict (key) do update set value = excluded.value;\n`;
fs.writeFileSync(new URL("../supabase/seed.sql", import.meta.url), out);
console.log("wrote supabase/seed.sql", out.length, "bytes");
