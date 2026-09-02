import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { classXResults, academicDocuments } from "@/lib/content/disclosure";

export const metadata: Metadata = {
  title: "CBSE Results",
  description:
    "Class X board examination results for The Chikhli Urban Vidyaniketan, as published in the school's CBSE mandatory public disclosure.",
  openGraph: {
    title: "CBSE Results",
    description: "Class X board examination results for The Chikhli Urban Vidyaniketan.",
  },
};

export default function ResultsPage() {
  const resultDoc = academicDocuments.find((d) => d.label.includes("board examination"));

  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="CBSE Results"
        intro="Class X board examination results, as filed with the Board."
        breadcrumb={[
          { label: "About", href: "/about" },
          { label: "CBSE Results", href: "/about/results" },
        ]}
      />

      <Section>
        <SectionHeading title="Class X" />

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {classXResults.map((r) => (
            <div key={r.year} className="rounded-lg border border-sand-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                {r.year}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-navy-800">
                {r.passPercentage}
              </p>
              <p className="mt-1 text-sm text-ink-500">{r.remarks ?? "Pass percentage"}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-500">
          Registered and passed student counts are not recorded in the currently published
          disclosure. Class XII is not applicable.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {resultDoc ? (
            <a
              href={resultDoc.href}
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
            >
              Download the board result document
              <span className="sr-only">, opens in a new tab</span>
            </a>
          ) : null}
          <Link
            href="/about/disclosure"
            className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
          >
            Full mandatory public disclosure
          </Link>
        </div>
      </Section>
    </>
  );
}
