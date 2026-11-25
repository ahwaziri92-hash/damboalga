import fs from "fs";
const D = JSON.parse(fs.readFileSync("/home/claude/work/demo_data.json","utf8"));
const P = D.PHOTO; const img = n => P[n] ? `/img/${P[n]}.jpg` : null;
const MON="JanFebMarAprMayJunJulAugSepOctNovDec";
function sortDate(d){const m=d.match(/^(\d{1,2}\s)?([A-Za-z]{3})?\s?(\d{4})$/);if(!m)return null;const mo=m[2]?MON.indexOf(m[2])/3+1:1;return `${m[3]}-${String(mo).padStart(2,"0")}-${String(m[1]?+m[1]:1).padStart(2,"0")}`}
const officeOf = t => (t||[]).includes("Hon. Ali Mohammed Kauji")?"chairman":(t||[]).includes("Dr. Mohammed Mai Bukar, PhD")?"state-member":null;
let news = D.NEWS.map(n=>({date_label:n.d,sort_date:sortDate(n.d),category:n.c,title:n.t,body:n.b,tags:n.tags||[],service_key:n.svc||null,is_video:!!n.vid,video_url:null,source_name:n.src?n.src[0]:null,source_url:n.src?n.src[1]:null,status:n.d==="Coming soon"?"draft":"published",office_key:officeOf(n.tags),image_url:null}));
news = news.concat(D.PNEWS.map(n=>({date_label:n.d,sort_date:sortDate(n.d),category:"Politics",title:n.t,body:n.b,tags:n.t.includes("Mai Bukar")?["Dr. Mohammed Mai Bukar, PhD"]:n.t.includes("Ndume")?["Sen. Mohammed Ali Ndume"]:[],service_key:null,is_video:false,video_url:null,source_name:null,source_url:null,status:"published",office_key:n.t.includes("Mai Bukar")?"state-member":null,image_url:null})));
news.push({date_label:"2026",sort_date:"2026-06-01",category:"Politics",title:"Dr. Mohammed Mai Bukar picks up nomination forms for the Damboa seat",body:D.MBNEWS[1].b,tags:["Dr. Mohammed Mai Bukar, PhD"],service_key:null,is_video:false,video_url:null,source_name:null,source_url:null,status:"published",office_key:"state-member",image_url:null});
const chairmen = D.LEADERS.filter(l=>l.ph!==false).map((l,i)=>({sort:i+1,name:l.nm,role:l.r,years:l.y,bio:l.b,photo_url:l.img?`/img/${l.img}.jpg`:img(l.nm),is_current:!!l.cur,show:true}));
const seats = D.SEATS.map((s,i)=>({key:s.id,sort:i+1,chamber:s.ch,title:s.seat,current_name:s.nm,current_years:s.yrs,photo_url:s.img?`/img/${s.img}.jpg`:null,page_slug:s.link||null,updates:(s.upd||[]).map(u=>({label:u[0],text:u[1]}))}));
const holders = []; D.SEATS.forEach(s=>s.hist.filter(h=>h[0]!=="Area").forEach((h,i)=>holders.push({seat_key:s.id,sort:i+1,years:h[0],name:h[1],note:h[2],is_current:!!h[3],photo_url:img(h[1])})));
seats.find(s=>s.key==="reps").area="Damboa, Gwoza and Chibok LGAs";
seats.find(s=>s.key==="senate").area="Askira/Uba, Bayo, Biu, Chibok, Damboa, Gwoza, Hawul, Kwaya Kusar, Shani";
seats.find(s=>s.key==="state").area="Damboa State Constituency";
const stakeholders=[];D.SKG.forEach((g,gi)=>g[1].forEach((p,i)=>stakeholders.push({grp:g[0],grp_sort:gi+1,sort:i+1,name:p.n,title:p.t,status:p.s||"",bio:p.bio||"",achievements:p.ach||[],is_current:!!p.cur,photo_url:img(p.n),show:true})));
const wards = D.WARDS.map(w=>({n:w.n,name:w.name,councillor:null,councillor_phone:null,villages:w.v.split("; "),polling_units:w.pus}));
const services = D.SVCS.map((v,i)=>({key:v.id,sort:i+1,icon:v.ic,name:v.n,location:v.loc,description:v.d,show_prices:!!v.prices}));
const prices = [["Maize","Mudu"],["Sorghum (guinea corn)","Mudu"],["Millet","Mudu"],["Beans","Mudu"],["Groundnut","Mudu"],["Local rice","Mudu"],["Gum arabic","kg"]].map((p,i)=>({sort:i+1,item:p[0],measure:p[1],price:null,change:null}));
const partners = D.HPART.map((p,i)=>({sort:i+1,name:p[0],description:p[1]}));
const heritage = D.HERITAGE.map((h,i)=>({sort:i+1,icon:h[0],title:h[1],body:h[2],note:h[3]||null}));
const officials=[["Executive Chairman","Hon. Ali Mohammed Kauji"],["Vice Chairman",null],["Secretary to the Local Government",null],["Director of Administration",null],["Head of Information Unit",null],["Treasurer",null]].map((o,i)=>({sort:i+1,office:o[0],name:o[1],phone:null}));
const pages=[
 {slug:"chairman",office_key:"chairman",name:"Hon. Ali Mohammed Kauji",role:"Executive Chairman",subtitle:"Damboa Local Government",years:"Jan 2024 – present",photo_url:"/img/chair.jpg",tag:"Hon. Ali Mohammed Kauji",
  bio:"Hon. Ali Mohammed Kauji (APC) was elected Executive Chairman of Damboa Local Government in January 2024 and returned in the council elections of 13 December 2025. He was sworn in for his current term on 29 January 2026. His administration works in line with the transformation agenda of His Excellency, Prof. Babagana Umara Zulum, mni, FNSE, Executive Governor of Borno State.",
  priorities:["Resettlement and security","Education","Health and nutrition","Agriculture and markets","Youth, skills and digital jobs","Roads, water and sanitation"],office_info:"LGA Secretariat, Maiduguri Road, Damboa. Visiting days to be added."},
 {slug:"mai-bukar",office_key:"state-member",name:"Dr. Mohammed Mai Bukar, PhD",role:"Member, Borno State House of Assembly",subtitle:"Damboa State Constituency",years:"",photo_url:"/img/member.jpg",tag:"Dr. Mohammed Mai Bukar, PhD",
  bio:"Dr. Mohammed Mai Bukar holds a doctorate (PhD) and is the All Progressives Congress (APC) candidate for Damboa State Constituency in the Borno State House of Assembly election of 6 February 2027. He previously served as an aide to the Executive Governor of Borno State, Prof. Babagana Umara Zulum, and in 2026 obtained the APC nomination forms for the Damboa seat.",
  priorities:["Education and skills","Health and nutrition","Security and resettlement","Farming and markets","Youth and digital jobs","Roads and water"],office_info:"Damboa town – address, phone and opening hours to be added."}
];
const settings={
 welcome_en:D.T.welP.en, welcome_ha:D.T.welP.ha,
 hero_en:D.T.heroP.en, hero_ha:D.T.heroP.ha,
 registered_parties:"22", population_est:"~341,700", land_area:"~4,800 km²",
 leaders:[{role:"President, Federal Republic of Nigeria",name:"His Excellency, Bola Ahmed Tinubu, GCFR",photo_url:"/img/tinubu.jpg"},{role:"Executive Governor, Borno State",name:"His Excellency, Prof. Babagana Umara Zulum, mni, FNSE",photo_url:"/img/zulum.jpg"},{role:"Shehu of Borno",name:"HRH Alhaji (Dr.) Abubakar Ibn Umar Garbai Al-Amin El-Kanemi",photo_url:"/img/shehu.jpg"}],
 incumbents:[["Governor, Borno State","Prof. Babagana Umara Zulum","APC"],["Senator, Borno South","Sen. Mohammed Ali Ndume","APC"],["Member, House of Reps (Damboa/Gwoza/Chibok)","Hon. Ahmadu Usman Jaha","APC"],["Member, State Assembly (Damboa)","Dr. Mohammed Mai Bukar, PhD","APC"],["Executive Chairman, Damboa LGA","Hon. Ali Mohammed Kauji","APC"]],
 elections:[["2027-01-16","Presidential and National Assembly"],["2027-02-06","Governorship and State House of Assembly"]],
 district_head:"Alhaji Zanna Lawan Maina"
};
const photos=Object.fromEntries(Object.entries(P).map(([k,v])=>[k,`/img/${v}.jpg`]));
fs.writeFileSync("lib/seed.json",JSON.stringify({news,chairmen,seats,holders,stakeholders,wards,services,prices,partners,heritage,officials,pages,settings,photos},null,1));
const M={WP2:D.WP2,NBR:D.NBR,NBRL:D.NBRL,SETS:D.SETS,TOWNS:D.TOWNS,PINS2:D.PINS2,DHQ:D.DHQ,LBL2:D.LBL2,MAPW:D.MAPW,MAPH:D.MAPH};
fs.writeFileSync("lib/mapdata.js","export const MAP="+JSON.stringify(M)+";\n");
console.log("news",news.length,"chairmen",chairmen.length,"holders",holders.length,"stake",stakeholders.length);
