// What the admin panel can edit. Field types: text, textarea, number, bool, date, select, list (one per line), image, video, json
export const CATEGORIES = ["History", "Governance", "Health", "Education", "Economy", "Digital", "Safety", "History", "Politics", "Humanitarian", "Jobs", "Video"];
export const OFFICES = [["lga", "LGA (Information Unit)"], ["chairman", "Executive Chairman"], ["state-member", "State Assembly member"], ["reps", "House of Reps member"], ["senate", "Senator"], ["humanitarian", "Humanitarian desk"]];

export const TABLES = {
  news: {
    label: "News", icon: "news", pk: "id", order: ["sort_date", false], title: r => r.title, sub: r => `${r.category} · ${r.date_label} · ${r.status}`,
    fields: [
      ["title", "Headline", "text", { required: true }],
      ["date_label", "Date shown (e.g. 13 Aug 2026 or Coming soon)", "text", { required: true }],
      ["sort_date", "Date (for ordering)", "date"],
      ["category", "Category", "select", { options: CATEGORIES }],
      ["body", "Story", "textarea", { rows: 6 }],
      ["image_url", "Photo", "image"],
      ["is_video", "This is a video story", "bool"],
      ["video_url", "Video (YouTube link or upload)", "video"],
      ["tags", "People tagged (one name per line, exactly as on their profile)", "list"],
      ["service_key", "Show under service (key, e.g. market, hospital, ict)", "text"],
      ["office_key", "Office", "select", { options: OFFICES, blank: true }],
      ["source_name", "Source name", "text"],
      ["source_url", "Source link", "text"],
      ["status", "Status", "select", { options: [["draft", "Draft"], ["pending", "Waiting for approval"], ["published", "Published"]] }],
    ],
    defaults: () => ({ status: "draft", category: "Governance", date_label: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), sort_date: new Date().toISOString().slice(0, 10), tags: [] }),
  },
  pages: {
    label: "Office pages", icon: "landmark", pk: "slug", order: ["slug", true], title: r => r.name, sub: r => r.role,
    fields: [["slug", "Page address (e.g. chairman, mai-bukar)", "text", { required: true, lockOnEdit: true }], ["office_key", "Office", "select", { options: OFFICES }], ["name", "Name", "text"], ["role", "Role", "text"], ["subtitle", "Subtitle", "text"], ["years", "Years in office", "text"], ["photo_url", "Photo", "image"], ["tag", "News tag (name used to tag stories)", "text"], ["bio", "Biography (blank line between paragraphs)", "textarea", { rows: 8 }], ["priorities", "Priorities (one per line)", "list"], ["office_info", "Office address and hours", "textarea"]],
  },
  chairmen: {
    label: "Chairmen", icon: "user", pk: "id", order: ["sort", true], title: r => r.name, sub: r => `${r.years || ""}${r.is_current ? " · current" : ""}`,
    fields: [["sort", "Order", "number"], ["name", "Name", "text", { required: true }], ["role", "Role", "text"], ["years", "Years", "text"], ["bio", "Biography", "textarea"], ["photo_url", "Photo", "image"], ["is_current", "Current chairman", "bool"], ["show", "Show on site", "bool"]],
    defaults: () => ({ show: true }),
  },
  seats: {
    label: "Legislative seats", icon: "seat", pk: "key", order: ["sort", true], title: r => r.title, sub: r => r.current_name,
    fields: [["key", "Key (state, reps, senate)", "text", { required: true, lockOnEdit: true }], ["sort", "Order", "number"], ["chamber", "Chamber", "text"], ["title", "Seat title", "text"], ["area", "Area covered", "text"], ["current_name", "Current holder", "text"], ["current_years", "Years", "text"], ["photo_url", "Photo", "image"], ["page_slug", "Own page address (blank if none)", "text"], ["updates", "Updates (JSON list of {label, text})", "json"]],
  },
  seat_holders: {
    label: "Seat history", icon: "scroll", pk: "id", order: ["sort", true], title: r => r.name, sub: r => `${r.seat_key} · ${r.years}`,
    fields: [["seat_key", "Seat key (state, reps, senate)", "text", { required: true }], ["sort", "Order", "number"], ["years", "Years", "text"], ["name", "Name", "text"], ["note", "Note / party", "text"], ["photo_url", "Photo", "image"], ["is_current", "Current holder", "bool"]],
  },
  stakeholders: {
    label: "Key stakeholders", icon: "users", pk: "id", order: ["grp_sort", true], title: r => r.name, sub: r => `${r.grp} · ${r.title || ""}`,
    fields: [["grp", "Group (e.g. Traditional rulers)", "text", { required: true }], ["grp_sort", "Group order", "number"], ["sort", "Order in group", "number"], ["name", "Name", "text", { required: true }], ["title", "Title", "text"], ["status", "Status (Current, Former, To be added)", "text"], ["bio", "Short biography", "textarea"], ["achievements", "Key achievements (one per line)", "list"], ["photo_url", "Photo", "image"], ["is_current", "Show news updates on profile", "bool"], ["show", "Show on site", "bool"]],
    defaults: () => ({ show: true, achievements: [] }),
  },
  wards: {
    label: "Wards & councillors", icon: "map", pk: "n", order: ["n", true], title: r => `${r.n}. ${r.name}`, sub: r => r.councillor || "Councillor to be added",
    fields: [["n", "Ward number", "number", { required: true, lockOnEdit: true }], ["name", "Ward name", "text"], ["councillor", "Councillor", "text"], ["councillor_phone", "Councillor phone", "text"], ["villages", "Main villages (one per line)", "list"], ["polling_units", "Polling units (one per line)", "list"]],
    noAdd: true,
  },
  officials: {
    label: "Council officials", icon: "file", pk: "id", order: ["sort", true], title: r => r.office, sub: r => r.name || "To be added",
    fields: [["sort", "Order", "number"], ["office", "Office", "text"], ["name", "Holder", "text"], ["phone", "Office phone", "text"]],
  },
  services: {
    label: "Services", icon: "pin", pk: "key", order: ["sort", true], title: r => r.name, sub: r => r.location,
    fields: [["key", "Key (used to link news)", "text", { required: true, lockOnEdit: true }], ["sort", "Order", "number"], ["icon", "Icon name: office, vote, laptop, hospital, clinic, market, school, forest, wheat, drum, pot, pin, road, farm (or an emoji)", "text"], ["name", "Name", "text"], ["location", "Location", "text"], ["description", "Description", "textarea"], ["show_prices", "Show weekly market prices", "bool"]],
  },
  market_prices: {
    label: "Market prices", icon: "wheat", pk: "id", order: ["sort", true], title: r => r.item, sub: r => `${r.measure || ""} · ₦${r.price || "—"}`,
    fields: [["sort", "Order", "number"], ["item", "Item", "text"], ["measure", "Measure", "text"], ["price", "Price (₦)", "text"], ["change", "Change (e.g. ▲ 200)", "text"]],
  },
  partners: {
    label: "Humanitarian partners", icon: "help", pk: "id", order: ["sort", true], title: r => r.name, sub: r => r.description,
    fields: [["sort", "Order", "number"], ["name", "Name", "text"], ["description", "What they do in Damboa", "textarea"]],
  },
  heritage: {
    label: "Heritage & places", icon: "forest", pk: "id", order: ["sort", true], title: r => r.title, sub: r => r.note,
    fields: [["sort", "Order", "number"], ["icon", "Icon name: office, vote, laptop, hospital, clinic, market, school, forest, wheat, drum, pot, pin, road, farm (or an emoji)", "text"], ["title", "Title", "text"], ["body", "Text", "textarea"], ["note", "Note", "text"], ["image_url", "Photo", "image"]],
  },
};

export const SETTINGS = [
  ["welcome_en", "Chairman's welcome (English)", "textarea"], ["welcome_ha", "Chairman's welcome (Hausa)", "textarea"],
  ["hero_en", "Home page intro (English)", "textarea"], ["hero_ha", "Home page intro (Hausa)", "textarea"],
  ["population_est", "Population estimate", "text"], ["land_area", "Land area", "text"], ["registered_parties", "Registered parties", "text"], ["district_head", "District Head (name)", "text"],
  ["leaders", "Leaders strip (JSON list of {role, name, photo_url})", "json"], ["incumbents", "Incumbents table (JSON list of [office, name, party])", "json"], ["elections", "Election dates (JSON list of [YYYY-MM-DD, name])", "json"],
];
// Who sees which section
export const ACCESS = {
  super_admin: ["dash", "news", "approvals", "messages", ...Object.keys(TABLES).filter(t => t !== "news"), "settings", "users"],
  editor: ["dash", "news", "messages", ...Object.keys(TABLES).filter(t => t !== "news"), "settings"],
  approver: ["dash", "approvals", "news"],
  office_admin: ["dash", "news", "messages", "mypage"],
  pending: [],
};
