import type { Circular } from "@/lib/types";

/**
 * Circulars, notices and events.
 *
 * DELIBERATELY EMPTY. The school has not published a circular or event list
 * anywhere that could be ported, and inventing notices for a real school is not
 * acceptable — parents act on them. The notice board renders an honest empty
 * state until the office adds the first entry through the CMS.
 *
 * The Instagram account (@vidyaniketan_chikhli) is the school's live channel and
 * is a good source for the first batch of real events to enter here.
 */
export const circulars: Circular[] = [];

export function upcomingEvents(now = new Date()): Circular[] {
  return circulars
    .filter((c) => c.kind === "event" && new Date(c.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export function latestCirculars(limit = 5): Circular[] {
  return [...circulars]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
}
