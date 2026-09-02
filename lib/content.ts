/**
 * Content resolver.
 *
 * Every page imports from here rather than from the CMS or the seed files
 * directly. When Sanity is configured its content wins; otherwise the ported
 * seed content is served. Either way the site renders.
 */
import { fetchOrFallback, isCmsConfigured } from "@/lib/sanity/client";
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

export { isCmsConfigured };

const PAGE_FIELDS = `slug, title, metaTitle, metaDescription, intro, body, bullets`;

export async function getSchool(): Promise<SchoolProfile> {
  return fetchOrFallback<SchoolProfile>(
    `*[_type == "school"][0]`,
    seedSchool,
  );
}

export async function getPages(): Promise<PageContent[]> {
  return fetchOrFallback<PageContent[]>(
    `*[_type == "page"]{ ${PAGE_FIELDS} }`,
    seedPages,
  );
}

export async function getPage(slug: string): Promise<PageContent | undefined> {
  const seed = seedPages.find((p) => p.slug === slug);
  const result = await fetchOrFallback<PageContent | null>(
    `*[_type == "page" && slug.current == $slug][0]{ ${PAGE_FIELDS} }`,
    seed ?? null,
    { slug },
  );
  return result ?? undefined;
}

export async function getFacilities(): Promise<Facility[]> {
  return fetchOrFallback<Facility[]>(
    `*[_type == "facility"] | order(order asc){ "slug": slug.current, title, summary, details }`,
    seedFacilities,
  );
}

export async function getCirculars(): Promise<Circular[]> {
  return fetchOrFallback<Circular[]>(
    `*[_type == "circular"] | order(date desc){ title, date, summary, href, kind }`,
    seedCirculars,
  );
}

export async function getUpcomingEvents(): Promise<Circular[]> {
  const all = await getCirculars();
  const now = Date.now();
  return all
    .filter((c) => c.kind === "event" && +new Date(c.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  return fetchOrFallback<GalleryAlbum[]>(
    `*[_type == "album"] | order(slug.current desc){
      "slug": slug.current, title, description,
      "images": images[]{ "src": asset->url, alt }
    }`,
    seedAlbums,
  );
}
