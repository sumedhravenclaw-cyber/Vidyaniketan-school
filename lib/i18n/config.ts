/**
 * The school is in Chikhli, Buldhana — Marathi is the state language and the
 * first language of most families here. English is kept as the default because
 * the school is an English-medium CBSE school and its statutory filings,
 * certificates and board correspondence are all in English.
 */
export const locales = ["en", "mr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  mr: { native: "मराठी", english: "Marathi" },
};

/** BCP 47 tags for <html lang> and hreflang. */
export const localeTags: Record<Locale, string> = {
  en: "en-IN",
  mr: "mr-IN",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefix a path with the locale segment: ("/about", "mr") -> "/mr/about" */
export function localePath(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path;
  return "/" + locale + clean;
}

/** Strip the locale segment: "/mr/about" -> "/about" */
export function stripLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && isLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? "/" + rest : "/";
  }
  return pathname || "/";
}
