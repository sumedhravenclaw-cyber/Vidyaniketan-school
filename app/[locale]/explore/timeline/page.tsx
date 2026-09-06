import type { Metadata } from "next";
import HistoricalTimeline from "@/components/historical-timeline";
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
  const description =
    locale === "mr"
      ? "आशिया, युरोप, अमेरिका आणि आफ्रिका एकाच काळात काय करत होते हे दाखवणारी संवादात्मक इतिहास कालरेषा."
      : "An interactive timeline showing what Asia, Europe, the Americas and Africa were each doing at the same moment in history.";

  return {
    title: dict.nav.timeline,
    description,
    openGraph: { title: dict.nav.timeline, description },
    alternates: {
      canonical: "/" + locale + "/explore/timeline",
      languages: {
        "en-IN": "/en/explore/timeline",
        "mr-IN": "/mr/explore/timeline",
      },
    },
  };
}

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.timeline.eyebrow}
        title={dict.nav.timeline}
        intro={dict.timeline.intro}
        breadcrumb={[
          { label: dict.nav.explore, href: "/" + locale + "/explore" },
          { label: dict.nav.timeline, href: "/" + locale + "/explore/timeline" },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section className="!py-0">
        {/* The hero already carries the title, so the component's own is suppressed. */}
        <HistoricalTimeline showIntro={false} />
      </Section>
    </>
  );
}
