import type { Metadata } from "next";
import GlobalChallengeTracker from "@/components/global-challenge-tracker";
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
      ? "हवामान, जंगलतोड, अवकाशातील कचरा आणि नवीकरणीय ऊर्जा यांचे थेट आकडे — दि चिखली अर्बन विद्यानिकेतनच्या विद्यार्थ्यांसाठी."
      : "Live figures on climate, forest loss, space debris and renewable energy — a data-literacy dashboard for students of The Chikhli Urban Vidyaniketan.";

  return {
    title: dict.nav.climateTracker,
    description,
    openGraph: { title: dict.nav.climateTracker, description },
    alternates: {
      canonical: "/" + locale + "/explore/climate-tracker",
      languages: {
        "en-IN": "/en/explore/climate-tracker",
        "mr-IN": "/mr/explore/climate-tracker",
      },
    },
  };
}

export default async function ClimateTrackerPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.climateTracker.eyebrow}
        title={dict.nav.climateTracker}
        intro={dict.climateTracker.intro}
        breadcrumb={[
          { label: dict.nav.explore, href: "/" + locale + "/explore" },
          { label: dict.nav.climateTracker, href: "/" + locale + "/explore/climate-tracker" },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section className="!py-0">
        {/*
          The hero above already carries the title, so the dashboard's own
          banner is suppressed — otherwise the page opens with two headings
          saying the same thing.
        */}
        <GlobalChallengeTracker showIntro={false} />

        <p className="mx-auto max-w-7xl px-4 pb-14 text-sm leading-relaxed text-ink-500">
          {dict.climateTracker.classroomNote}
        </p>
      </Section>
    </>
  );
}
