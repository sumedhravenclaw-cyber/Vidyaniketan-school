import type { Metadata } from "next";
import Link from "next/link";
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
    title: dict.nav.explore,
    description: dict.explore.intro,
    openGraph: { title: dict.nav.explore, description: dict.explore.intro },
    alternates: {
      canonical: "/" + locale + "/explore",
      languages: { "en-IN": "/en/explore", "mr-IN": "/mr/explore" },
    },
  };
}

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const tools = [
    {
      href: "/" + locale + "/explore/climate-tracker",
      title: dict.nav.climateTracker,
      body: dict.explore.climateCard,
      eyebrow: dict.climateTracker.eyebrow,
    },
    {
      href: "/" + locale + "/explore/ai-hub",
      title: dict.nav.aiHub,
      body: dict.explore.aiHubCard,
      eyebrow: dict.aiHub.eyebrow,
    },
    {
      href: "/" + locale + "/explore/timeline",
      title: dict.nav.timeline,
      body: dict.explore.timelineCard,
      eyebrow: dict.timeline.eyebrow,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.explore.eyebrow}
        title={dict.nav.explore}
        intro={dict.explore.intro}
        breadcrumb={[{ label: dict.nav.explore, href: "/" + locale + "/explore" }]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.href} className="overflow-hidden rounded-lg border border-mist-200 bg-white">
              <span aria-hidden className="block h-1 bg-crimson-500" />
              <div className="flex h-full flex-col p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson-600">
                  {tool.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-maroon-800">
                  {tool.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{tool.body}</p>
                <Link
                  href={tool.href}
                  className="mt-5 self-start rounded bg-crimson-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-600"
                >
                  {dict.explore.open}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
