import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import {
  generalInformationFor,
  statutoryDocumentsFor,
  academicDocumentsFor,
  classXResults,
  staffAndTeachingFor,
  schoolInfrastructureFor,
  remarkFor,
} from "@/lib/content/disclosure";
import type { DisclosureDocument, DisclosureRow } from "@/lib/types";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale).disclosure;
  return {
    title: d.title,
    description: d.intro,
    openGraph: { title: d.title, description: d.intro },
    alternates: {
      canonical: "/" + locale + "/about/disclosure",
      languages: {
        "en-IN": "/en/about/disclosure",
        "mr-IN": "/mr/about/disclosure",
      },
    },
  };
}

function formatSize(bytes?: number): string {
  if (!bytes) return "PDF";
  if (bytes < 1024 * 1024) return "PDF · " + Math.round(bytes / 1024) + " KB";
  return "PDF · " + (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function RowTable({ rows }: { rows: DisclosureRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-mist-200 bg-white">
      <table className="w-full min-w-md border-collapse text-left text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-mist-200 last:border-0">
              <th
                scope="row"
                className="w-1/2 px-5 py-3.5 align-top font-medium text-ink-500"
              >
                {r.label}
              </th>
              <td className="px-5 py-3.5 align-top font-medium text-maroon-800">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentTable({ docs, dict }: { docs: DisclosureDocument[]; dict: Dictionary }) {
  return (
    <ol className="divide-y divide-mist-200 overflow-hidden rounded-lg border border-mist-200 bg-white">
      {docs.map((d, i) => (
        <li
          key={d.href}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 py-4"
        >
          <span className="flex gap-3 text-sm text-ink-600">
            <span aria-hidden className="tabular-nums text-gold-600">
              {i + 1}.
            </span>
            <span>{d.label}</span>
          </span>
          <a
            href={d.href}
            target="_blank"
            rel="noreferrer noopener"
            className="shrink-0 text-sm font-semibold text-crimson-600 underline-offset-4 hover:underline"
          >
            {dict.disclosure.view}{" "}
            <span className="font-normal text-ink-500">({formatSize(d.sizeBytes)})</span>
            <span className="sr-only">{dict.common.opensInNewTab}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default async function DisclosurePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const d = dict.disclosure;

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.title}
        intro={d.intro}
        breadcrumb={[
          { label: dict.nav.about, href: "/" + locale + "/about" },
          { label: d.title, href: "/" + locale + "/about/disclosure" },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <SectionHeading eyebrow="A" title={d.sectionA} />
        <div className="mt-6">
          <RowTable rows={generalInformationFor(locale)} />
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading eyebrow="B" title={d.sectionB} intro={d.sectionBIntro} />
        <div className="mt-6">
          <DocumentTable docs={statutoryDocumentsFor(locale)} dict={dict} />
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading eyebrow="C" title={d.sectionC} />
        <div className="mt-6">
          <DocumentTable docs={academicDocumentsFor(locale)} dict={dict} />
        </div>

        <h3 className="mt-12 font-display text-xl font-semibold text-maroon-800">
          {dict.results.classX}
        </h3>
        <div className="mt-4 overflow-x-auto rounded-lg border border-mist-200 bg-white">
          <table className="w-full min-w-lg border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-gold-500 bg-mist-100">
                <th className="px-5 py-3 font-semibold text-maroon-800">{dict.results.year}</th>
                <th className="px-5 py-3 font-semibold text-maroon-800">
                  {dict.results.registered}
                </th>
                <th className="px-5 py-3 font-semibold text-maroon-800">
                  {dict.results.passed}
                </th>
                <th className="px-5 py-3 font-semibold text-maroon-800">
                  {dict.results.passPercentage}
                </th>
                <th className="px-5 py-3 font-semibold text-maroon-800">
                  {dict.results.remarks}
                </th>
              </tr>
            </thead>
            <tbody>
              {classXResults.map((r) => (
                <tr key={r.year} className="border-b border-mist-200 last:border-0">
                  <td className="px-5 py-3 tabular-nums text-ink-600">{r.year}</td>
                  <td className="px-5 py-3 tabular-nums text-ink-500">{r.registered ?? "—"}</td>
                  <td className="px-5 py-3 tabular-nums text-ink-500">{r.passed ?? "—"}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums text-maroon-800">
                    {r.passPercentage}
                  </td>
                  <td className="px-5 py-3 text-ink-500">{remarkFor(r.remarks, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-500">{dict.results.classXIINotApplicable}</p>
      </Section>

      <Section className="!pt-0">
        <SectionHeading eyebrow="D" title={d.sectionD} />
        <div className="mt-6">
          <RowTable rows={staffAndTeachingFor(locale)} />
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading eyebrow="E" title={d.sectionE} />
        <div className="mt-6">
          <RowTable rows={schoolInfrastructureFor(locale)} />
        </div>
      </Section>
    </>
  );
}
