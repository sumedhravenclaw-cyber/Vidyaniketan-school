import Link from "next/link";
import { Section } from "@/components/ui";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Rendered for unmatched paths inside a locale. Next does not pass params to
 * not-found, so this uses the default locale's copy and links into it; the
 * language switcher in the header still works from here.
 */
export default function NotFound() {
  const locale = defaultLocale;
  const dict = getDictionary(locale);
  const p = (path: string) => "/" + locale + path;

  const links = [
    { label: dict.nav.home, href: "/" + locale },
    { label: dict.nav.aboutSchool, href: p("/about") },
    { label: dict.nav.admissions, href: p("/admissions") },
    { label: dict.nav.disclosure, href: p("/about/disclosure") },
    { label: dict.nav.contact, href: p("/contact") },
  ];

  return (
    <Section>
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson-600">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-maroon-800 sm:text-4xl">
          {dict.notFound.title}
        </h1>
        <span aria-hidden className="mt-4 block h-0.5 w-16 bg-gold-500" />
        <p className="mt-4 text-base leading-relaxed text-ink-600">{dict.notFound.body}</p>
        <ul className="mt-6 space-y-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
