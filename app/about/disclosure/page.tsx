import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import {
  generalInformation,
  statutoryDocuments,
  academicDocuments,
  classXResults,
  staffAndTeaching,
  schoolInfrastructure,
} from "@/lib/content/disclosure";
import type { DisclosureDocument, DisclosureRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mandatory Public Disclosure",
  description:
    "CBSE mandatory public disclosure (Appendix IX) for The Chikhli Urban Vidyaniketan — general information, statutory documents, results, staff and infrastructure.",
  openGraph: {
    title: "Mandatory Public Disclosure",
    description:
      "CBSE mandatory public disclosure for The Chikhli Urban Vidyaniketan, affiliation no. 1130688.",
  },
};

function formatSize(bytes?: number): string {
  if (!bytes) return "PDF";
  if (bytes < 1024 * 1024) return "PDF · " + Math.round(bytes / 1024) + " KB";
  return "PDF · " + (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function RowTable({ rows }: { rows: DisclosureRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-sand-200 bg-white">
      <table className="w-full min-w-md border-collapse text-left text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-sand-200 last:border-0">
              <th
                scope="row"
                className="w-1/2 px-5 py-3.5 align-top font-medium text-ink-500"
              >
                {r.label}
              </th>
              <td className="px-5 py-3.5 align-top font-medium text-navy-800">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentTable({ docs }: { docs: DisclosureDocument[] }) {
  return (
    <ol className="divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
      {docs.map((d, i) => (
        <li
          key={d.href}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 py-4"
        >
          <span className="flex gap-3 text-sm text-ink-600">
            <span aria-hidden className="tabular-nums text-ink-500">
              {i + 1}.
            </span>
            <span>{d.label}</span>
          </span>
          <a
            href={d.href}
            target="_blank"
            rel="noreferrer noopener"
            className="shrink-0 text-sm font-semibold text-vermilion-600 underline-offset-4 hover:underline"
          >
            View <span className="font-normal text-ink-500">({formatSize(d.sizeBytes)})</span>
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function DisclosurePage() {
  return (
    <>
      <PageHero
        eyebrow="Appendix IX"
        title="Mandatory Public Disclosure"
        intro="Published in accordance with the Central Board of Secondary Education's affiliation bye-laws."
        breadcrumb={[
          { label: "About", href: "/about" },
          { label: "Mandatory Public Disclosure", href: "/about/disclosure" },
        ]}
      />

      <Section>
        <SectionHeading eyebrow="Section A" title="General information" />
        <div className="mt-6">
          <RowTable rows={generalInformation} />
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading
          eyebrow="Section B"
          title="Documents and information"
          intro="Self-attested copies as filed with the Board."
        />
        <div className="mt-6">
          <DocumentTable docs={statutoryDocuments} />
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading eyebrow="Section C" title="Results and academics" />
        <div className="mt-6">
          <DocumentTable docs={academicDocuments} />
        </div>

        <h3 className="mt-12 font-display text-xl font-semibold text-navy-800">
          Result: Class X
        </h3>
        <div className="mt-4 overflow-x-auto rounded-lg border border-sand-200 bg-white">
          <table className="w-full min-w-lg border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-100">
                <th className="px-5 py-3 font-semibold text-navy-800">Year</th>
                <th className="px-5 py-3 font-semibold text-navy-800">Registered</th>
                <th className="px-5 py-3 font-semibold text-navy-800">Passed</th>
                <th className="px-5 py-3 font-semibold text-navy-800">Pass percentage</th>
                <th className="px-5 py-3 font-semibold text-navy-800">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {classXResults.map((r) => (
                <tr key={r.year} className="border-b border-sand-200 last:border-0">
                  <td className="px-5 py-3 tabular-nums text-ink-600">{r.year}</td>
                  <td className="px-5 py-3 tabular-nums text-ink-500">{r.registered ?? "—"}</td>
                  <td className="px-5 py-3 tabular-nums text-ink-500">{r.passed ?? "—"}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums text-navy-800">
                    {r.passPercentage}
                  </td>
                  <td className="px-5 py-3 text-ink-500">{r.remarks ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-500">
          Class XII: not applicable.
        </p>
      </Section>

      <Section className="!pt-0">
        <SectionHeading eyebrow="Section D" title="Staff and teaching" />
        <div className="mt-6">
          <RowTable rows={staffAndTeaching} />
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading eyebrow="Section E" title="School infrastructure" />
        <div className="mt-6">
          <RowTable rows={schoolInfrastructure} />
        </div>
      </Section>
    </>
  );
}
