import type { Metadata } from "next";
import AiHubFrame from "@/components/ai-hub-frame";
import { PageHero, Section } from "@/components/ui";
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

  return {
    title: dict.nav.aiHub,
    description: dict.aiHub.intro,
    openGraph: { title: dict.nav.aiHub, description: dict.aiHub.intro },
    alternates: {
      canonical: "/" + locale + "/explore/ai-hub",
      languages: {
        "en-IN": "/en/explore/ai-hub",
        "mr-IN": "/mr/explore/ai-hub",
      },
    },
  };
}

export default async function AiHubPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.aiHub.eyebrow}
        title={dict.nav.aiHub}
        intro={dict.aiHub.intro}
        breadcrumb={[
          { label: dict.nav.explore, href: "/" + locale + "/explore" },
          { label: dict.nav.aiHub, href: "/" + locale + "/explore/ai-hub" },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <AiHubFrame src="/ai-hub.html" title={dict.nav.aiHub} />

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-500">
          {dict.aiHub.classroomNote}
        </p>
      </Section>
    </>
  );
}
