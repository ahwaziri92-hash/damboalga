import "@fontsource/fraunces/700.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/700.css";
import "../globals.css";
import "../extra.css";
import "./admin.css";
export const metadata = { title: "Damboa LGA – Admin", robots: { index: false, follow: false } };
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0f5132" };
export default function AdminLayout({ children }) { return <html lang="en"><body>{children}</body></html>; }
