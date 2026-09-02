import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Prose, Section } from "@/components/ui";
import { contentPages, findPage } from "@/lib/content/pages";
import { getPage } from "@/lib/content";

/** "about" has its own route file; the rest are rendered here. */
const dynamicSlugs = contentPages.filter((p) => p.slug !== "about");

export function generateStaticParams() {
  return dynamicSlugs.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription,
    openGraph: { title: page.title, description: page.metaDescription },
  };
}

export default async function AboutSubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow="About"
        title={page.title}
        intro={page.intro}
        breadcrumb={[
          { label: "About", href: "/about" },
          { label: page.title, href: "/about/" + page.slug },
        ]}
      />
      <Section>
        <Prose paragraphs={page.body} bullets={page.bullets} />
      </Section>
    </>
  );
}
