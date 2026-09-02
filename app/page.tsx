import Image from "next/image";
import Link from "next/link";
import { Cta, EmptyState, Section, SectionHeading } from "@/components/ui";
import { school, headlineStats, infrastructure } from "@/lib/content/school";
import { aboutPage, uniqueFeaturesPage } from "@/lib/content/pages";
import { classXResults } from "@/lib/content/disclosure";
import { featuredImages } from "@/lib/content/gallery";
import { admissionContactNote, currentAdmissionCycle } from "@/lib/content/admissions";
import { getUpcomingEvents } from "@/lib/content";

const HERO_IMAGE =
  "https://vidyaniketanchikhli.com/wp-content/uploads/2018/09/Building-Photo.jpg";

export default async function HomePage() {
  const events = await getUpcomingEvents();

  return (
    <>
      {/* Hero */}
      <section className="on-navy relative isolate overflow-hidden bg-navy-900">
        <Image
          src={HERO_IMAGE}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="deva text-lg text-gold-400">{school.motto.sanskrit}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl">
              {school.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-100">
              {school.tagline}. An English-medium school affiliated to the {school.board},
              on a {infrastructure.campusAreaSqm.toLocaleString("en-IN")} square metre
              campus in Chikhli.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href="/admissions">Admissions</Cta>
              <Cta href="/about" variant="onDark">
                About the school
              </Cta>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-navy-700 bg-navy-700">
            {headlineStats.map((s) => (
              <div key={s.label} className="bg-navy-800 px-5 py-6">
                <dt className="text-xs uppercase tracking-[0.12em] text-navy-200">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-white tabular-nums sm:text-3xl">
                  {s.value.toLocaleString("en-IN")}
                  {s.suffix ? (
                    <span className="ml-1 text-base font-normal text-navy-200">
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
      <div className="border-b border-sand-200 bg-vermilion-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <p className="text-sm text-ink-600">
            <span className="font-semibold text-vermilion-700">
              {currentAdmissionCycle
                ? "Admissions " + currentAdmissionCycle
                : "Admissions"}
            </span>{" "}
            &mdash; {admissionContactNote}
          </p>
          <Cta href="/admissions">Enquire now</Cta>
        </div>
      </div>

      {/* About */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Our story" title="Why this school exists" />
            <p className="mt-5 text-base leading-relaxed text-ink-600">{aboutPage.intro}</p>
            <p className="mt-4 text-base leading-relaxed text-ink-600">{aboutPage.body[0]}</p>
            <p className="mt-4 text-base leading-relaxed text-ink-600">{aboutPage.body[1]}</p>
            <div className="mt-7">
              <Cta href="/about" variant="secondary">
                Read the full story
              </Cta>
            </div>
          </div>

          <div className="rounded-lg border border-sand-200 bg-white p-7">
            <h3 className="font-display text-xl font-semibold text-navy-800">
              {uniqueFeaturesPage.title}
            </h3>
            <ul className="mt-5 space-y-3">
              {uniqueFeaturesPage.bullets?.slice(0, 6).map((b) => (
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
                href="/about/unique-features"
                className="text-sm font-semibold text-vermilion-600 underline-offset-4 hover:underline"
              >
                See everything that sets us apart
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Results */}
      <div className="border-y border-sand-200 bg-sand-100">
        <Section className="!py-14">
          <SectionHeading
            eyebrow="Board examinations"
            title="Class X results"
            intro="Published pass percentages, as filed in the school's CBSE mandatory public disclosure."
          />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-md border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-sand-200">
                  <th className="py-3 pr-6 font-semibold text-navy-800">Year</th>
                  <th className="py-3 pr-6 font-semibold text-navy-800">Registered</th>
                  <th className="py-3 pr-6 font-semibold text-navy-800">Passed</th>
                  <th className="py-3 pr-6 font-semibold text-navy-800">Pass percentage</th>
                  <th className="py-3 font-semibold text-navy-800">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {classXResults.map((r) => (
                  <tr key={r.year} className="border-b border-sand-200 last:border-0">
                    <td className="py-3 pr-6 tabular-nums text-ink-600">{r.year}</td>
                    <td className="py-3 pr-6 tabular-nums text-ink-500">
                      {r.registered ?? "—"}
                    </td>
                    <td className="py-3 pr-6 tabular-nums text-ink-500">
                      {r.passed ?? "—"}
                    </td>
                    <td className="py-3 pr-6 font-semibold tabular-nums text-navy-800">
                      {r.passPercentage}
                    </td>
                    <td className="py-3 text-ink-500">{r.remarks ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-500">
            <Link
              href="/about/disclosure"
              className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
            >
              View the full mandatory public disclosure
            </Link>
          </p>
        </Section>
      </div>

      {/* Events */}
      <Section>
        <SectionHeading eyebrow="What's on" title="Upcoming events" />
        <div className="mt-8">
          {events.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 6).map((e) => (
                <li
                  key={e.title + e.date}
                  className="rounded-lg border border-sand-200 bg-white p-6"
                >
                  <time
                    dateTime={e.date}
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-vermilion-600"
                  >
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <h3 className="mt-2 font-display text-lg font-semibold text-navy-800">
                    {e.title}
                  </h3>
                  {e.summary ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{e.summary}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No events published yet">
              School events are announced here once the office adds them. In the
              meantime, the school posts regularly on{" "}
              <a
                href={school.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
              >
                Instagram
              </a>
              .
            </EmptyState>
          )}
        </div>
      </Section>

      {/* Gallery preview */}
      <div className="border-t border-sand-200 bg-sand-100">
        <Section className="!py-14">
          <SectionHeading
            eyebrow="Life at school"
            title="From the gallery"
            intro="Photographs from school events and everyday life on campus."
          />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredImages.map((img) => (
              <li
                key={img.src}
                className="relative aspect-4/3 overflow-hidden rounded-lg bg-sand-200"
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
            <Cta href="/gallery" variant="secondary">
              View the full gallery
            </Cta>
          </div>
        </Section>
      </div>
    </>
  );
}
