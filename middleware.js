import { NextResponse } from "next/server";
// Every public page is pre-built in English (/en/...) and Hausa (/ha/...).
// Visitors keep clean addresses (/news); this picks the right version from the "lang" cookie.
export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (/^\/(en|ha)(\/|$)/.test(pathname)) return NextResponse.next();
  const lang = req.cookies.get("lang")?.value === "ha" ? "ha" : "en";
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}
export const config = { matcher: ["/((?!admin|api|_next|img|favicon|robots|sitemap|.*\\..*).*)"] };
