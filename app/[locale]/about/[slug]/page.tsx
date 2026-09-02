import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Prose, Section } from "@/components/ui";
import { contentPages } from "@/lib/content/pages";
import { getPage } from "@/lib/content";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** "about" has its own route file; the rest are rendered here. */
const dynamicSlugs = contentPages.filter((p) => p.slug !== "about").map((p) => p.slug);

export function generateStaticParams() {
  return locales.flatMap((locale) => dynamicSlugs.map((slug) => ({ locale, slug })));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const page = await getPage(slug, locale);
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription,
    openGraph: { title: page.title, description: page.metaDescription },
    alternates: {
      canonical: "/" + locale + "/about/" + slug,
      languages: { "en-IN": "/en/about/" + slug, "mr-IN": "/mr/about/" + slug },
    },
  };
}

export default async function AboutSubPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const page = await getPage(slug, locale);
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow={dict.nav.about}
        title={page.title}
        intro={page.intro}
        breadcrumb={[
          { label: dict.nav.about, href: "/" + locale + "/about" },
          { label: page.title, href: "/" + locale + "/about/" + page.slug },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />
      <Section>
        <Prose paragraphs={page.body} bullets={page.bullets} />
      </Section>
    </>
  );
}
