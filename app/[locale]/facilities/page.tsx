import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { getFacilities } from "@/lib/content";
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
      ? "जास्तीत जास्त 40 विद्यार्थ्यांच्या वर्गखोल्या, सहा प्रयोगशाळा, विस्तीर्ण क्रीडांगणे, बंदिस्त खेळ सभागृह, जलतरण तलाव आणि वाहतूक सुविधा — 20,000 चौरस मीटरच्या परिसरात."
      : "Classrooms capped at 40 children, six laboratories, large playgrounds, an indoor games hall, a swimming pool and school transport, on a 20,000 square metre campus.";
  return {
    title: dict.nav.facilities,
    description,
    openGraph: { title: dict.nav.facilities, description },
    alternates: {
      canonical: "/" + locale + "/facilities",
      languages: { "en-IN": "/en/facilities", "mr-IN": "/mr/facilities" },
    },
  };
}

export default async function FacilitiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const facilities = await getFacilities(locale);

  return (
    <>
      <PageHero
        eyebrow={locale === "mr" ? "परिसर" : "Campus"}
        title={dict.nav.facilities}
        intro={
          locale === "mr"
            ? "जाफराबाद रोडवरील 20,000 चौरस मीटरच्या परिसरात शाळा काय पुरवते."
            : "What the school provides, on a 20,000 square metre campus on Jafrabad Road."
        }
        breadcrumb={[{ label: dict.nav.facilities, href: "/" + locale + "/facilities" }]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <li key={f.slug}>
              <Link
                href={"/" + locale + "/facilities/" + f.slug}
                className="flex h-full flex-col overflow-hidden rounded-lg border border-mist-200 bg-white transition-colors hover:border-gold-500"
              >
                <span aria-hidden className="block h-1 bg-maroon-600" />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-xl font-semibold text-maroon-800">
                    {f.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                    {f.summary}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-crimson-600">
                    {dict.common.readMore}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
