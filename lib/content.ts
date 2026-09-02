/**
 * Content resolver.
 *
 * Every page imports from here rather than from the CMS or the seed files
 * directly. When Sanity is configured its content wins; otherwise the ported
 * seed content is served. Either way the site renders.
 *
 * Each getter takes a locale. Sanity documents are filtered on a `locale`
 * field; the seed content falls back to English when a Marathi translation
 * does not exist for a given item, so a half-translated CMS never produces a
 * blank page.
 */
import { fetchOrFallback, isCmsConfigured } from "@/lib/sanity/client";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import type {
  Circular,
  Facility,
  GalleryAlbum,
  PageContent,
  SchoolProfile,
} from "@/lib/types";

import { school as seedSchool } from "@/lib/content/school";
import { contentPages as seedPages } from "@/lib/content/pages";
import { facilities as seedFacilities } from "@/lib/content/facilities";
import { circulars as seedCirculars } from "@/lib/content/circulars";
import { galleryAlbums as seedAlbums } from "@/lib/content/gallery";
import {
  schoolMr,
  contentPagesMr,
  facilitiesMr,
} from "@/lib/content/mr";

export { isCmsConfigured };

const PAGE_FIELDS = "slug, title, metaTitle, metaDescription, intro, body, bullets";

function seedSchoolFor(locale: Locale): SchoolProfile {
  return locale === "mr" ? schoolMr : seedSchool;
}

function seedPagesFor(locale: Locale): PageContent[] {
  return locale === "mr" ? contentPagesMr : seedPages;
}

function seedFacilitiesFor(locale: Locale): Facility[] {
  return locale === "mr" ? facilitiesMr : seedFacilities;
}

export async function getSchool(locale: Locale = defaultLocale): Promise<SchoolProfile> {
  return fetchOrFallback<SchoolProfile>(
    '*[_type == "school" && locale == $locale][0]',
    seedSchoolFor(locale),
    { locale },
  );
}

export async function getPages(locale: Locale = defaultLocale): Promise<PageContent[]> {
  return fetchOrFallback<PageContent[]>(
    `*[_type == "page" && locale == $locale]{ ${PAGE_FIELDS} }`,
    seedPagesFor(locale),
    { locale },
  );
}

export async function getPage(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<PageContent | undefined> {
  // Fall back to English if this page has no translation yet.
  const seed =
    seedPagesFor(locale).find((p) => p.slug === slug) ??
    seedPages.find((p) => p.slug === slug);

  const result = await fetchOrFallback<PageContent | null>(
    `*[_type == "page" && slug.current == $slug && locale == $locale][0]{ ${PAGE_FIELDS} }`,
    seed ?? null,
    { slug, locale },
  );
  return result ?? undefined;
}

export async function getFacilities(locale: Locale = defaultLocale): Promise<Facility[]> {
  return fetchOrFallback<Facility[]>(
    '*[_type == "facility" && locale == $locale] | order(order asc){ "slug": slug.current, title, summary, details }',
    seedFacilitiesFor(locale),
    { locale },
  );
}

export function findFacilityFor(slug: string, locale: Locale): Facility | undefined {
  return (
    seedFacilitiesFor(locale).find((f) => f.slug === slug) ??
    seedFacilities.find((f) => f.slug === slug)
  );
}

export async function getCirculars(locale: Locale = defaultLocale): Promise<Circular[]> {
  return fetchOrFallback<Circular[]>(
    '*[_type == "circular" && locale == $locale] | order(date desc){ title, date, summary, href, kind }',
    seedCirculars,
    { locale },
  );
}

export async function getUpcomingEvents(
  locale: Locale = defaultLocale,
): Promise<Circular[]> {
  const all = await getCirculars(locale);
  const now = Date.now();
  return all
    .filter((c) => c.kind === "event" && +new Date(c.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export async function getGalleryAlbums(
  locale: Locale = defaultLocale,
): Promise<GalleryAlbum[]> {
  return fetchOrFallback<GalleryAlbum[]>(
    `*[_type == "album"] | order(slug.current desc){
      "slug": slug.current, title, description,
      "images": images[]{ "src": asset->url, "alt": coalesce(alt[$locale], alt.en) }
    }`,
    seedAlbums,
    { locale },
  );
}
