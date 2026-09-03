import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { SchoolProfile } from "@/lib/types";

export default function SiteFooter({
  locale,
  dict,
  school,
}: {
  locale: Locale;
  dict: Dictionary;
  school: SchoolProfile;
}) {
  const a = school.address;
  const p = (path: string) => "/" + locale + path;

  const quickLinks = [
    { label: dict.nav.aboutSchool, href: p("/about") },
    { label: dict.nav.admissions, href: p("/admissions") },
    { label: dict.nav.disclosure, href: p("/about/disclosure") },
    { label: dict.nav.results, href: p("/about/results") },
    { label: dict.nav.gallery, href: p("/gallery") },
    { label: dict.nav.contact, href: p("/contact") },
  ];

  return (
    <footer className="on-maroon mt-24 bg-maroon-900 text-maroon-100">
      {/* Same three-colour rule as the header, mirrored. */}
      <div aria-hidden className="flex h-1">
        <span className="w-1/4 bg-crimson-500" />
        <span className="w-1/4 bg-gold-500" />
        <span className="w-1/2 bg-maroon-600" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <Image
            src="/logo.jpg"
            alt={
              locale === "mr"
                ? school.name + " चा बोधचिन्ह"
                : "Crest of " + school.name
            }
            width={176}
            height={176}
            className="h-20 w-20 rounded-full ring-2 ring-gold-500/50"
          />
          <p className="deva mt-5 text-lg text-gold-400">{school.motto.sanskrit}</p>
          <p className="mt-1 text-sm text-maroon-200">{school.motto.translation}</p>
          <h2 className="mt-4 font-display text-xl font-semibold text-white">
            {school.name}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-maroon-200">
            {dict.home.heroLead}
          </p>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">
            {dict.common.quickLinks}
          </h3>
          <span aria-hidden className="mt-2 block h-0.5 w-10 bg-gold-500" />
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-maroon-200 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">
            {dict.common.contactHeading}
          </h3>
          <span aria-hidden className="mt-2 block h-0.5 w-10 bg-gold-500" />
          <address className="mt-4 space-y-3 text-sm not-italic text-maroon-200">
            <p className="leading-relaxed">
              {a.line1}
              <br />
              {a.line2}
              <br />
              {a.city}, {a.district}
              <br />
              {a.state} &ndash; {a.pin}
            </p>
            <p>
              <a
                className="transition-colors hover:text-white"
                href={"tel:" + school.primaryPhone.replace(/\s/g, "")}
              >
                {school.primaryPhone}
              </a>
            </p>
            <p>
              <a
                className="break-all transition-colors hover:text-white"
                href={"mailto:" + school.email}
              >
                {school.email}
              </a>
            </p>
            <p className="text-maroon-200">{school.officeHours}</p>
            <p className="text-maroon-200">{dict.common.sundayClosed}</p>
          </address>

          <div className="mt-5 flex gap-4 text-sm">
            {school.social.instagram ? (
              <a
                href={school.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="text-maroon-200 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Instagram
              </a>
            ) : null}
            {school.social.youtube ? (
              <a
                href={school.social.youtube}
                target="_blank"
                rel="noreferrer noopener"
                className="text-maroon-200 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                YouTube
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-maroon-700">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-maroon-200">
          <p>
            &copy; {new Date().getFullYear()} {school.name}. {dict.common.allRightsReserved}
          </p>
          <p>
            {dict.common.affiliationNo} {school.affiliationNo} &middot;{" "}
            {dict.common.schoolCode} {school.schoolCode}
          </p>
          <p>
            {dict.common.developedBy}{" "}
            <a
              href="https://www.digitalravenclaw.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Digital Ravenclaw
              <span className="sr-only">{dict.common.opensInNewTab}</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
