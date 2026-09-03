import type { Metadata } from "next";
import { PageHero, Section, SectionHeading, EmptyState } from "@/components/ui";
import { getCirculars, getUpcomingEvents, getSchool } from "@/lib/content";
import type { Circular } from "@/lib/types";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

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
      ? "दि चिखली अर्बन विद्यानिकेतन, चिखली, बुलढाणा येथील सूचना, परिपत्रके व आगामी कार्यक्रम."
      : "Notices, circulars and upcoming events from The Chikhli Urban Vidyaniketan, Chikhli, Buldhana.";
  return {
    title: dict.circulars.title,
    description,
    openGraph: { title: dict.circulars.title, description },
    alternates: {
      canonical: "/" + locale + "/circulars",
      languages: { "en-IN": "/en/circulars", "mr-IN": "/mr/circulars" },
    },
  };
}

function kindLabel(kind: Circular["kind"], dict: Dictionary): string {
  return {
    circular: dict.circulars.kindCircular,
    event: dict.circulars.kindEvent,
    result: dict.circulars.kindResult,
    admission: dict.circulars.kindAdmission,
  }[kind];
}

function NoticeList({
  items,
  dict,
  locale,
}: {
  items: Circular[];
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <ul className="divide-y divide-mist-200 overflow-hidden rounded-lg border border-mist-200 bg-white">
      {items.map((c) => (
        <li key={c.title + c.date} className="px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold-600">
              {kindLabel(c.kind, dict)}
            </span>
            <time dateTime={c.date} className="text-xs tabular-nums text-ink-500">
              {new Date(c.date).toLocaleDateString(locale === "mr" ? "mr-IN" : "en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold text-maroon-800">
            {c.href ? (
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer noopener"
                className="underline-offset-4 hover:underline"
              >
                {c.title}
              </a>
            ) : (
              c.title
            )}
          </h3>
          {c.summary ? (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{c.summary}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default async function CircularsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [all, events, school] = await Promise.all([
    getCirculars(locale),
    getUpcomingEvents(locale),
    getSchool(locale),
  ]);
  const notices = all.filter((c) => c.kind !== "event");

  return (
    <>
      <PageHero
        eyebrow={dict.circulars.eyebrow}
        title={dict.circulars.title}
        intro={dict.circulars.intro}
        breadcrumb={[{ label: dict.circulars.title, href: "/" + locale + "/circulars" }]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <SectionHeading title={dict.circulars.upcoming} />
        <div className="mt-6">
          {events.length > 0 ? (
            <NoticeList items={events} dict={dict} locale={locale} />
          ) : (
            <EmptyState title={dict.circulars.noEvents}>{dict.home.noEventsBody}</EmptyState>
          )}
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading title={dict.circulars.noticesTitle} />
        <div className="mt-6">
          {notices.length > 0 ? (
            <NoticeList items={notices} dict={dict} locale={locale} />
          ) : (
            <EmptyState title={dict.circulars.noCirculars}>
              {dict.home.noEventsBody}{" "}
              <a
                href={school.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
              >
                Instagram
              </a>
              .
            </EmptyState>
          )}
        </div>
      </Section>
    </>
  );
}
