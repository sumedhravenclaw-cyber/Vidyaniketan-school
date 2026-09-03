import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Prose, Section, SectionHeading, Cta } from "@/components/ui";
import { staff, infrastructure } from "@/lib/content/school";
import { getPage, getSchool } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = await getPage("about", locale);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    openGraph: { title: page.title, description: page.metaDescription },
    alternates: {
      canonical: "/" + locale + "/about",
      languages: { "en-IN": "/en/about", "mr-IN": "/mr/about" },
    },
  };
}

const CAMPUS_IMAGE =
  "https://vidyaniketanchikhli.com/wp-content/uploads/2018/09/Building-Photo.jpg";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [page, school] = await Promise.all([getPage("about", locale), getSchool(locale)]);
  if (!page) return null;

  const facts = [
    { label: dict.common.board, value: "CBSE" },
    { label: dict.common.affiliationNo, value: school.affiliationNo },
    { label: dict.common.schoolCode, value: school.schoolCode },
    {
      label: dict.home.campusArea,
      value: infrastructure.campusAreaSqm.toLocaleString("en-IN") + " sq m",
    },
    { label: dict.home.classrooms, value: String(infrastructure.classrooms) },
    { label: dict.home.teachingStaff, value: String(staff.totalTeachers) },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.nav.about}
        title={page.title}
        intro={page.intro}
        breadcrumb={[{ label: dict.nav.aboutSchool, href: "/" + locale + "/about" }]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Prose paragraphs={page.body} />

          <div className="space-y-6">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-mist-200 ring-2 ring-gold-500/40">
              <Image
                src={CAMPUS_IMAGE}
                alt={
                  locale === "mr"
                    ? school.name + " ची इमारत, जाफराबाद रोड, चिखली"
                    : "The " + school.name + " school building on Jafrabad Road, Chikhli"
                }
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="overflow-hidden rounded-lg border border-mist-200 bg-white">
              <span aria-hidden className="block h-1 bg-gold-500" />
              <dl className="divide-y divide-mist-200">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 px-5 py-3"
                  >
                    <dt className="text-sm text-ink-500">{f.label}</dt>
                    <dd className="text-right text-sm font-medium tabular-nums text-maroon-800">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      <div className="border-t border-mist-200 bg-mist-100">
        <Section className="!py-14">
          <SectionHeading
            eyebrow={locale === "mr" ? "नेतृत्व" : "Leadership"}
            title={locale === "mr" ? "मुख्याध्यापक" : "Principal"}
            intro="Gaurav Vandankumar Shete, M.Sc., B.Ed."
          />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600">
            {locale === "mr"
              ? "शाळेत विशेष शिक्षिका " +
                staff.specialEducator +
                " आणि समुपदेशक व स्वास्थ्य शिक्षक " +
                staff.counsellor +
                " कार्यरत आहेत."
              : "The school also has a dedicated special educator, " +
                staff.specialEducator +
                ", and a counsellor and wellness teacher, " +
                staff.counsellor +
                "."}
          </p>
          <div className="mt-7">
            <Cta href={"/" + locale + "/about/disclosure"} variant="secondary">
              {dict.nav.disclosure}
            </Cta>
          </div>
        </Section>
      </div>
    </>
  );
}
