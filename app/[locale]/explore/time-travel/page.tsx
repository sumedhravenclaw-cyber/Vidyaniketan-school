import type { Metadata } from "next";
import TimeTravelTimeline from "@/components/time-travel-timeline";
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
      ? "प्राचीन इजिप्त, प्रबोधनकालीन इटली, औद्योगिक क्रांती आणि कल्पित २१०० — चार कालखंडांत पाऊल टाकून पाहणारी संवादात्मक दृश्ये."
      : "Step inside Ancient Egypt, Renaissance Italy, the Industrial Revolution and an imagined 2100 — interactive scenes with facts to uncover.";

  return {
    title: dict.nav.timeTravel,
    description,
    openGraph: { title: dict.nav.timeTravel, description },
    alternates: {
      canonical: "/" + locale + "/explore/time-travel",
      languages: {
        "en-IN": "/en/explore/time-travel",
        "mr-IN": "/mr/explore/time-travel",
      },
    },
  };
}

export default async function TimeTravelPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.timeTravel.eyebrow}
        title={dict.nav.timeTravel}
        intro={dict.timeTravel.intro}
        breadcrumb={[
          { label: dict.nav.explore, href: "/" + locale + "/explore" },
          { label: dict.nav.timeTravel, href: "/" + locale + "/explore/time-travel" },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section className="!py-0">
        {/* The hero already carries the title, so the component's own is suppressed. */}
        <TimeTravelTimeline showIntro={false} />
      </Section>
    </>
  );
}
