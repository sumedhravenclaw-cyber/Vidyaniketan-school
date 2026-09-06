import type { Metadata } from "next";
import LivingHistoryAtlas from "@/components/living-history-atlas";
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
      ? "ख्रिस्तपूर्व ३००० ते आजपर्यंत जगाचे सहा प्रदेश कसे बदलत गेले हे दाखवणारा संवादात्मक नकाशा."
      : "An interactive map timeline showing how six regions of the world changed from 3000 BCE to today.";

  return {
    title: dict.nav.historyMap,
    description,
    openGraph: { title: dict.nav.historyMap, description },
    alternates: {
      canonical: "/" + locale + "/explore/history-map",
      languages: {
        "en-IN": "/en/explore/history-map",
        "mr-IN": "/mr/explore/history-map",
      },
    },
  };
}

export default async function HistoryMapPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.historyMap.eyebrow}
        title={dict.nav.historyMap}
        intro={dict.historyMap.intro}
        breadcrumb={[
          { label: dict.nav.explore, href: "/" + locale + "/explore" },
          { label: dict.nav.historyMap, href: "/" + locale + "/explore/history-map" },
        ]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        {/* The hero already carries the title, so the component's own is suppressed. */}
        <LivingHistoryAtlas showIntro={false} />
      </Section>
    </>
  );
}
