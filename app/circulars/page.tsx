import type { Metadata } from "next";
import { PageHero, Section, SectionHeading, EmptyState } from "@/components/ui";
import { getCirculars, getUpcomingEvents } from "@/lib/content";
import { school } from "@/lib/content/school";
import type { Circular } from "@/lib/types";

export const metadata: Metadata = {
  title: "Circulars & Events",
  description:
    "Notices, circulars and upcoming events from The Chikhli Urban Vidyaniketan, Chikhli, Buldhana.",
  openGraph: {
    title: "Circulars & Events",
    description: "Notices, circulars and upcoming events from The Chikhli Urban Vidyaniketan.",
  },
};

const KIND_LABEL: Record<Circular["kind"], string> = {
  circular: "Circular",
  event: "Event",
  result: "Result",
  admission: "Admission",
};

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function NoticeList({ items }: { items: Circular[] }) {
  return (
    <ul className="divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
      {items.map((c) => (
        <li key={c.title + c.date} className="px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
              {KIND_LABEL[c.kind]}
            </span>
            <time dateTime={c.date} className="text-xs tabular-nums text-ink-500">
              {formatDate(c.date)}
            </time>
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold text-navy-800">
            {c.href ? (
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer noopener"
                className="underline-offset-4 hover:underline"
              >
                {c.title}
              </a>
            ) : (
              c.title
            )}
          </h3>
          {c.summary ? (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{c.summary}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default async function CircularsPage() {
  const [all, events] = await Promise.all([getCirculars(), getUpcomingEvents()]);
  const notices = all.filter((c) => c.kind !== "event");

  return (
    <>
      <PageHero
        eyebrow="Notice board"
        title="Circulars & Events"
        intro="Announcements from the school office."
        breadcrumb={[{ label: "Circulars & Events", href: "/circulars" }]}
      />

      <Section>
        <SectionHeading title="Upcoming events" />
        <div className="mt-6">
          {events.length > 0 ? (
            <NoticeList items={events} />
          ) : (
            <EmptyState title="No events published yet">
              Events appear here once the school office adds them.
            </EmptyState>
          )}
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeading title="Circulars and notices" />
        <div className="mt-6">
          {notices.length > 0 ? (
            <NoticeList items={notices} />
          ) : (
            <EmptyState title="No circulars published yet">
              Notices to parents will be posted here. The school currently shares day-to-day
              news on{" "}
              <a
                href={school.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
              >
                Instagram
              </a>
              .
            </EmptyState>
          )}
        </div>
      </Section>
    </>
  );
}
