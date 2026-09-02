import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Prose, Section } from "@/components/ui";
import { facilities } from "@/lib/content/facilities";
import { findFacilityFor } from "@/lib/content";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  return locales.flatMap((locale) => facilities.map((f) => ({ locale, slug: f.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const facility = findFacilityFor(slug, locale);
  if (!facility) return {};
  return {
    title: facility.title,
    description: facility.summary,
    openGraph: { title: facility.title, description: facility.summary },
    alternates: {
      canonical: "/" + locale + "/facilities/" + slug,
      languages: {
        "en-IN": "/en/facilities/" + slug,
        "mr-IN": "/mr/facilities/" + slug,
      },
    },
  };
}

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const facility = findFacilityFor(slug, locale);
  if (!facility) notFound();

  return (
    <>
      <PageHero
        eyebrow={dict.nav.facilities}
        title={facility.title}
        intro={facility.summary}
        breadcrumb={[
          { label: dict.nav.facilities, href: "/" + locale + "/facilities" },
          { label: facility.title, href: "/" + locale + "/facilities/" + facility.slug },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />
      <Section>
        <Prose paragraphs={facility.details} />
      </Section>
    </>
  );
}
