import { cookies } from "next/headers";
export const DICT = {
  home:{en:"Home",ha:"Gida"},about:{en:"About Damboa",ha:"Game da Damboa"},leaders:{en:"Leadership",ha:"Shugabanci"},legis:{en:"Legislators",ha:"'Yan Majalisa"},wards:{en:"Wards & Villages",ha:"Mazabu da Kauyuka"},news:{en:"News",ha:"Labarai"},human:{en:"Humanitarian",ha:"Agaji"},politics:{en:"Political Activities",ha:"Harkokin Siyasa"},contact:{en:"Services & Contact",ha:"Hidimomi da Tuntuba"},
  wardsS:{en:"Wards",ha:"Mazabu"},legisS:{en:"Reps",ha:"Wakilai"},moreT:{en:"More",ha:"Kari"},
  state:{en:"Borno State, Nigeria · Official Website",ha:"Jihar Borno, Najeriya · Shafin Hukuma"},
  managed:{en:"Managed by the Damboa LGA Administration and Information Unit. Political content is published only with the Executive Chairman's approval.",ha:"Sashen Mulki da Yada Labarai na Karamar Hukumar Damboa ne ke kula da shafin. Ana wallafa bayanan siyasa ne kawai da amincewar Shugaban Karamar Hukuma."},
  tech:{en:"Technical support: Youth for Digital Change (Y4DC), powered by Chirallia Information Technology and Innovation (CITI).",ha:"Tallafin fasaha: Youth for Digital Change (Y4DC), tare da Chirallia Information Technology and Innovation (CITI)."},
  heroT:{en:"Welcome to Damboa",ha:"Barka da zuwa Damboa"},
  welT:{en:"A message from the Executive Chairman",ha:"Sako daga Shugaban Karamar Hukuma"},
  latest:{en:"Latest news",ha:"Sabbin labarai"},quick:{en:"Quick links",ha:"Hanyoyin gaggawa"},mapT:{en:"Damboa at a glance",ha:"Damboa a takaice"},
  all:{en:"All news",ha:"Duk labarai"},more:{en:"Read more",ha:"Kara karantawa"},
  send:{en:"Send",ha:"Aika"},sent:{en:"Thank you. Your message has been sent to the office.",ha:"Mun gode. An aika sakonka zuwa ofishin."},
  pus:{en:"polling units",ha:"rumfunan zabe"},councillor:{en:"Councillor",ha:"Kansila"},
  chairPage:{en:"Visit the Chairman's page",ha:"Shafin Shugaba"},
  openPage:{en:"Open page",ha:"Bude shafi"},
  source:{en:"Source",ha:"Asali"},
};
export async function getLang() { const c = await cookies(); return c.get("lang")?.value === "ha" ? "ha" : "en"; }
export function tr(L) { return k => (DICT[k] && DICT[k][L]) || k; }
