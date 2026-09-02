import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { getFacilities } from "@/lib/content";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Classrooms capped at 40 children, six laboratories, large playgrounds, an indoor games hall, a swimming pool and school transport, on a 20,000 square metre campus.",
  openGraph: {
    title: "Facilities",
    description:
      "Classrooms, laboratories, sports facilities, transport and campus at The Chikhli Urban Vidyaniketan.",
  },
};

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return (
    <>
      <PageHero
        eyebrow="Campus"
        title="Facilities"
        intro="What the school provides, on a 20,000 square metre campus on Jafrabad Road."
        breadcrumb={[{ label: "Facilities", href: "/facilities" }]}
      />

      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <li key={f.slug}>
              <Link
                href={"/facilities/" + f.slug}
                className="flex h-full flex-col rounded-lg border border-sand-200 bg-white p-6 transition-colors hover:border-vermilion-500"
              >
                <h2 className="font-display text-xl font-semibold text-navy-800">
                  {f.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                  {f.summary}
                </p>
                <span className="mt-5 text-sm font-semibold text-vermilion-600">
                  Read more
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
