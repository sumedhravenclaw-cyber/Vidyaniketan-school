import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { classXResults, academicDocumentsFor, remarkFor } from "@/lib/content/disclosure";
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
      ? "शाळेच्या सीबीएसई अनिवार्य सार्वजनिक प्रकटीकरणात नोंदविलेले इयत्ता दहावीचे मंडळ परीक्षा निकाल."
      : "Class X board examination results, as published in the school's CBSE mandatory public disclosure.";
  return {
    title: dict.nav.results,
    description,
    openGraph: { title: dict.nav.results, description },
    alternates: {
      canonical: "/" + locale + "/about/results",
      languages: { "en-IN": "/en/about/results", "mr-IN": "/mr/about/results" },
    },
  };
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const resultDoc = academicDocumentsFor("en").find((d) => d.label.includes("board examination"));

  return (
    <>
      <PageHero
        eyebrow={dict.home.resultsEyebrow}
        title={dict.nav.results}
        intro={dict.home.resultsIntro}
        breadcrumb={[
          { label: dict.nav.about, href: "/" + locale + "/about" },
          { label: dict.nav.results, href: "/" + locale + "/about/results" },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <SectionHeading title={dict.results.classX} />

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {classXResults.map((r) => (
            <div
              key={r.year}
              className="overflow-hidden rounded-lg border border-mist-200 bg-white"
            >
              <span aria-hidden className="block h-1 bg-gold-500" />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                  {r.year}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-maroon-800">
                  {r.passPercentage}
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  {r.remarks ? remarkFor(r.remarks, locale) : dict.results.passPercentage}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-500">
          {dict.results.countsMissing} {dict.results.classXIINotApplicable}
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {resultDoc ? (
            <a
              href={resultDoc.href}
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
            >
              {dict.results.downloadResult}
              <span className="sr-only">{dict.common.opensInNewTab}</span>
            </a>
          ) : null}
          <Link
            href={"/" + locale + "/about/disclosure"}
            className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
          >
            {dict.nav.disclosure}
          </Link>
        </div>
      </Section>
    </>
  );
}
