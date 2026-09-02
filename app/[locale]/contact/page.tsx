import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { fullAddress } from "@/lib/content/school";
import { getSchool } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const description =
    locale === "mr"
      ? "दि चिखली अर्बन विद्यानिकेतन, जाफराबाद रोड, चिखली, बुलढाणा, महाराष्ट्र 443201 — पत्ता, दूरध्वनी, ईमेल व कार्यालयीन वेळ."
      : "Address, phone, email and office hours for The Chikhli Urban Vidyaniketan, Jafrabad Road, Chikhli, Buldhana, Maharashtra 443201.";
  return {
    title: dict.nav.contact,
    description,
    openGraph: { title: dict.nav.contact, description },
    alternates: {
      canonical: "/" + locale + "/contact",
      languages: { "en-IN": "/en/contact", "mr-IN": "/mr/contact" },
    },
  };
}

/**
 * OpenStreetMap rather than Google Maps: no API key, no advertising cookies,
 * and no consent banner. The old contact page had no map at all.
 */
const MAP_BBOX = "76.2350,20.3300,76.2750,20.3620";
const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=" +
  MAP_BBOX +
  "&layer=mapnik&marker=20.3460,76.2550";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const school = await getSchool(locale);
  const a = school.address;
  const c = dict.contact;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={dict.nav.contact}
        intro={c.intro}
        breadcrumb={[{ label: dict.nav.contact, href: "/" + locale + "/contact" }]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading title={c.officeTitle} />

            <div className="mt-6 overflow-hidden rounded-lg border border-sand-200 bg-white">
              <span aria-hidden className="block h-1 bg-navy-600" />
              <dl className="divide-y divide-sand-200">
                <div className="px-6 py-5">
                  <dt className="text-sm text-ink-500">{dict.common.address}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-navy-800">
                    {a.line1}
                    <br />
                    {a.line2}
                    <br />
                    {a.city}, {a.district}
                    <br />
                    {a.state} &ndash; {a.pin}
                  </dd>
                </div>

                <div className="px-6 py-5">
                  <dt className="text-sm text-ink-500">{dict.common.phone}</dt>
                  <dd className="mt-1 text-sm">
                    <a
                      href={"tel:" + school.primaryPhone.replace(/\s/g, "")}
                      className="font-semibold text-navy-800 underline-offset-4 hover:underline"
                    >
                      {school.primaryPhone}
                    </a>
                  </dd>
                </div>

                <div className="px-6 py-5">
                  <dt className="text-sm text-ink-500">{dict.common.email}</dt>
                  <dd className="mt-1 break-all text-sm">
                    <a
                      href={"mailto:" + school.email}
                      className="font-semibold text-navy-800 underline-offset-4 hover:underline"
                    >
                      {school.email}
                    </a>
                  </dd>
                </div>

                <div className="px-6 py-5">
                  <dt className="text-sm text-ink-500">{dict.common.officeHours}</dt>
                  <dd className="mt-1 text-sm text-navy-800">
                    {school.officeHours}
                    <br />
                    <span className="text-ink-500">{dict.common.sundayClosed}</span>
                  </dd>
                </div>

                <div className="px-6 py-5">
                  <dt className="text-sm text-ink-500">CBSE</dt>
                  <dd className="mt-1 text-sm tabular-nums text-navy-800">
                    {dict.common.affiliationNo} {school.affiliationNo}
                    <br />
                    {dict.common.schoolCode} {school.schoolCode}
                  </dd>
                </div>
              </dl>
            </div>

            <a
              href={
                "mailto:" +
                school.email +
                "?subject=" +
                encodeURIComponent(locale === "mr" ? "संकेतस्थळावरून चौकशी" : "Website enquiry")
              }
              className="mt-7 inline-flex items-center rounded-md bg-vermilion-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vermilion-600"
            >
              {c.emailOffice}
            </a>
          </div>

          <div>
            <SectionHeading title={c.findingUs} />
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-600">
              {c.findingUsBody}
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-sand-200 bg-sand-100 ring-1 ring-gold-500/30">
              <iframe
                title={c.mapAlt}
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-96 w-full border-0"
              />
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-500">{c.mapNote}</p>

            <a
              href={
                "https://www.openstreetmap.org/search?query=" +
                encodeURIComponent(fullAddress())
              }
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-block text-sm font-semibold text-vermilion-600 underline-offset-4 hover:underline"
            >
              {c.openInMaps}
              <span className="sr-only">{dict.common.opensInNewTab}</span>
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
