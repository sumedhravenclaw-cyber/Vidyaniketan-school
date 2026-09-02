import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale, isLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(?:jpg|jpeg|png|svg|ico|webp|gif|txt|xml|pdf|woff2?)$/i;

/**
 * Sends every un-prefixed path to a locale.
 *
 * A returning visitor keeps whatever they last chose (cookie). A first-time
 * visitor gets the language their browser asks for, so a Marathi-configured
 * phone in Buldhana lands on Marathi without touching the switcher — but the
 * URL is always explicit afterwards, which is what makes the pages
 * individually shareable and indexable.
 */
function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language");
  if (header) {
    const preferred = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { tag } of preferred) {
      const base = tag.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (l) => pathname === "/" + l || pathname.startsWith("/" + l + "/"),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = "/" + locale + (pathname === "/" ? "" : pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
