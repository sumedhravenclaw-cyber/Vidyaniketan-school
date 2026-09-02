import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Prose, Section, SectionHeading, Cta } from "@/components/ui";
import { aboutPage } from "@/lib/content/pages";
import { school, staff, infrastructure } from "@/lib/content/school";

export const metadata: Metadata = {
  title: aboutPage.title,
  description: aboutPage.metaDescription,
  openGraph: { title: aboutPage.title, description: aboutPage.metaDescription },
};

const CAMPUS_IMAGE =
  "https://vidyaniketanchikhli.com/wp-content/uploads/2018/09/Building-Photo.jpg";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={aboutPage.title}
        intro={aboutPage.intro}
        breadcrumb={[{ label: "About", href: "/about" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <Prose paragraphs={aboutPage.body} />

          <div className="space-y-6">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-sand-200">
              <Image
                src={CAMPUS_IMAGE}
                alt={"The " + school.name + " school building on Jafrabad Road, Chikhli"}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>

            <dl className="divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
              <div className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-ink-500">Board</dt>
                <dd className="text-right text-sm font-medium text-navy-800">CBSE</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-ink-500">Affiliation number</dt>
                <dd className="text-right text-sm font-medium tabular-nums text-navy-800">
                  {school.affiliationNo}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-ink-500">School code</dt>
                <dd className="text-right text-sm font-medium tabular-nums text-navy-800">
                  {school.schoolCode}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-ink-500">Campus area</dt>
                <dd className="text-right text-sm font-medium tabular-nums text-navy-800">
                  {infrastructure.campusAreaSqm.toLocaleString("en-IN")} sq m
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-ink-500">Classrooms</dt>
                <dd className="text-right text-sm font-medium tabular-nums text-navy-800">
                  {infrastructure.classrooms}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-ink-500">Teaching staff</dt>
                <dd className="text-right text-sm font-medium tabular-nums text-navy-800">
                  {staff.totalTeachers}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <div className="border-t border-sand-200 bg-sand-100">
        <Section className="!py-14">
          <SectionHeading
            eyebrow="Leadership"
            title="Principal"
            intro="Gaurav Vandankumar Shete, M.Sc., B.Ed."
          />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600">
            The school also has a dedicated special educator, {staff.specialEducator}, and a
            counsellor and wellness teacher, {staff.counsellor}.
          </p>
          <div className="mt-7">
            <Cta href="/about/disclosure" variant="secondary">
              Mandatory public disclosure
            </Cta>
          </div>
        </Section>
      </div>
    </>
  );
}
