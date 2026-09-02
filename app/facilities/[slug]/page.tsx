import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Prose, Section } from "@/components/ui";
import { facilities, findFacility } from "@/lib/content/facilities";

export function generateStaticParams() {
  return facilities.map((f) => ({ slug: f.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facility = findFacility(slug);
  if (!facility) return {};
  return {
    title: facility.title,
    description: facility.summary,
    openGraph: { title: facility.title, description: facility.summary },
  };
}

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const facility = findFacility(slug);
  if (!facility) notFound();

  return (
    <>
      <PageHero
        eyebrow="Facilities"
        title={facility.title}
        intro={facility.summary}
        breadcrumb={[
          { label: "Facilities", href: "/facilities" },
          { label: facility.title, href: "/facilities/" + facility.slug },
        ]}
      />
      <Section>
        <Prose paragraphs={facility.details} />
      </Section>
    </>
  );
}
