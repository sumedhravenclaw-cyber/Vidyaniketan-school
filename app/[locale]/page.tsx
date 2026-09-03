import Image from "next/image";
import Link from "next/link";
import { Cta, EmptyState, Section, SectionHeading } from "@/components/ui";
import { infrastructure } from "@/lib/content/school";
import { classXResults, remarkFor } from "@/lib/content/disclosure";
import { featuredImages } from "@/lib/content/gallery";
import { admissionContactNote, currentAdmissionCycle } from "@/lib/content/admissions";
import { getSchool, getPage, getUpcomingEvents } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const HERO_IMAGE =
  "https://vidyaniketanchikhli.com/wp-content/uploads/2018/09/Building-Photo.jpg";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const p = (path: string) => "/" + locale + path;

  const [school, about, features, events] = await Promise.all([
    getSchool(locale),
    getPage("about", locale),
    getPage("unique-features", locale),
    getUpcomingEvents(locale),
  ]);

  const stats = [
    { label: dict.home.campusArea, value: infrastructure.campusAreaSqm, suffix: " sq m" },
    { label: dict.home.classrooms, value: infrastructure.classrooms },
    { label: dict.home.laboratories, value: infrastructure.labs },
    { label: dict.home.teachingStaff, value: 77 },
  ];

  return (
    <>
      {/*
        Hero. The hero box is floored at a fixed height per breakpoint rather than
        left to size itself from the copy. Marathi sets far shorter than English
        here — the name fits on one line instead of two, the lead in two lines
        instead of three — which changed the section's aspect ratio and so
        changed how `object-cover` scaled and cropped the building behind it.
        The two locales showed visibly different crops of the same photograph.
        These floors are the English heights, so English is unchanged and
        Marathi rises to meet it; revisit them if the English hero copy changes.
      */}
      <section className="on-maroon relative isolate flex min-h-[765px] items-center overflow-hidden bg-maroon-900 sm:min-h-[802px] lg:min-h-[551px]">
        <Image
          src={HERO_IMAGE}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Scrim only where the text sits. It clears to nothing by the midpoint
            so the right-hand side of the building stays fully visible. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-maroon-900/90 via-maroon-900/55 to-transparent"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            {/* The crest is in the header on every page, this one included, so
                it is not repeated here — the building is the hero image. */}
            <p className="deva text-lg text-gold-400">{school.motto.sanskrit}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl">
              {school.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-maroon-100">
              {school.tagline}. {dict.home.heroLead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href={p("/admissions")}>{dict.nav.admissions}</Cta>
              <Cta href={p("/about")} variant="onDark">
                {dict.nav.aboutSchool}
              </Cta>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-maroon-700 bg-maroon-700">
            {stats.map((s) => (
              <div key={s.label} className="relative bg-maroon-800 px-5 py-6">
                <span aria-hidden className="absolute inset-x-5 top-0 h-0.5 bg-gold-500/60" />
                <dt className="text-xs uppercase tracking-[0.12em] text-maroon-200">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-white tabular-nums sm:text-3xl">
                  {s.value.toLocaleString("en-IN")}
                  {s.suffix ? (
                    <span className="ml-1 text-base font-normal text-maroon-200">
                      {s.suffix}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Admissions strip */}
      <div className="border-b border-mist-200 bg-crimson-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <p className="text-sm text-ink-600">
            <span className="font-semibold text-crimson-700">
              {currentAdmissionCycle
                ? dict.nav.admissions + " " + currentAdmissionCycle
                : dict.nav.admissions}
            </span>{" "}
            &mdash; {locale === "mr" ? dict.admissions.contactOfficeBody : admissionContactNote}
          </p>
          <Cta href={p("/admissions")}>{dict.common.enquireNow}</Cta>
        </div>
      </div>

      {/* About */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow={dict.home.storyEyebrow} title={dict.home.storyTitle} />
            {about?.intro ? (
              <p className="mt-5 text-base leading-relaxed text-ink-600">{about.intro}</p>
            ) : null}
            {about?.body.slice(0, 2).map((para, i) => (
              <p key={i} className="mt-4 text-base leading-relaxed text-ink-600">
                {para}
              </p>
            ))}
            <div className="mt-7">
              <Cta href={p("/about")} variant="secondary">
                {dict.common.readFullStory}
              </Cta>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-mist-200 bg-white">
            <span aria-hidden className="block h-1 bg-gold-500" />
            <div className="p-7">
              <h3 className="font-display text-xl font-semibold text-maroon-800">
                {features?.title ?? dict.nav.uniqueFeatures}
              </h3>
              <ul className="mt-5 space-y-3">
                {features?.bullets?.slice(0, 6).map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed text-ink-600">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href={p("/about/unique-features")}
                  className="text-sm font-semibold text-crimson-600 underline-offset-4 hover:underline"
                >
                  {dict.home.seeAllFeatures}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Results */}
      <div className="border-y border-mist-200 bg-mist-100">
        <Section className="!py-14">
          <SectionHeading
            eyebrow={dict.home.resultsEyebrow}
            title={dict.home.resultsTitle}
            intro={dict.home.resultsIntro}
          />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-md border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gold-500">
                  <th className="py-3 pr-6 font-semibold text-maroon-800">{dict.results.year}</th>
                  <th className="py-3 pr-6 font-semibold text-maroon-800">
                    {dict.results.registered}
                  </th>
                  <th className="py-3 pr-6 font-semibold text-maroon-800">
                    {dict.results.passed}
                  </th>
                  <th className="py-3 pr-6 font-semibold text-maroon-800">
                    {dict.results.passPercentage}
                  </th>
                  <th className="py-3 font-semibold text-maroon-800">{dict.results.remarks}</th>
                </tr>
              </thead>
              <tbody>
                {classXResults.map((r) => (
                  <tr key={r.year} className="border-b border-mist-200 last:border-0">
                    <td className="py-3 pr-6 tabular-nums text-ink-600">{r.year}</td>
                    <td className="py-3 pr-6 tabular-nums text-ink-500">
                      {r.registered ?? "—"}
                    </td>
                    <td className="py-3 pr-6 tabular-nums text-ink-500">{r.passed ?? "—"}</td>
                    <td className="py-3 pr-6 font-semibold tabular-nums text-maroon-800">
                      {r.passPercentage}
                    </td>
                    <td className="py-3 text-ink-500">{remarkFor(r.remarks, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-500">
            <Link
              href={p("/about/disclosure")}
              className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
            >
              {dict.home.viewDisclosure}
            </Link>
          </p>
        </Section>
      </div>

      {/* Events */}
      <Section>
        <SectionHeading eyebrow={dict.home.eventsEyebrow} title={dict.home.eventsTitle} />
        <div className="mt-8">
          {events.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 6).map((e) => (
                <li
                  key={e.title + e.date}
                  className="overflow-hidden rounded-lg border border-mist-200 bg-white"
                >
                  <span aria-hidden className="block h-1 bg-crimson-500" />
                  <div className="p-6">
                    <time
                      dateTime={e.date}
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-crimson-600"
                    >
                      {new Date(e.date).toLocaleDateString(locale === "mr" ? "mr-IN" : "en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-2 font-display text-lg font-semibold text-maroon-800">
                      {e.title}
                    </h3>
                    {e.summary ? (
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">{e.summary}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title={dict.home.noEvents}>
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

      {/* Gallery preview */}
      <div className="border-t border-mist-200 bg-mist-100">
        <Section className="!py-14">
          <SectionHeading
            eyebrow={dict.home.galleryEyebrow}
            title={dict.home.galleryTitle}
            intro={dict.home.galleryIntro}
          />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredImages.map((img) => (
              <li
                key={img.src}
                className="relative aspect-4/3 overflow-hidden rounded-lg bg-mist-200 ring-1 ring-gold-500/25"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Cta href={p("/gallery")} variant="secondary">
              {dict.home.viewFullGallery}
            </Cta>
          </div>
        </Section>
      </div>
    </>
  );
}
