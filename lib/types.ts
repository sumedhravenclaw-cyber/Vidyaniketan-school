/**
 * Content shapes shared by the seed content and the Sanity CMS.
 *
 * Both sources resolve to these types, so pages never need to know which one
 * is answering. See `lib/content.ts` for the resolver.
 */

export type SchoolProfile = {
  name: string;
  shortName: string;
  motto: { sanskrit: string; translation: string };
  tagline: string;
  affiliationNo: string;
  schoolCode: string;
  board: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    district: string;
    state: string;
    pin: string;
  };
  /** The number to publish everywhere. The old site carried three different ones. */
  primaryPhone: string;
  altPhones: string[];
  email: string;
  officeHours: string;
  social: { youtube?: string; instagram?: string };
};

export type Stat = {
  label: string;
  value: number;
  /** Rendered after the counter, e.g. "sq m" or "+". */
  suffix?: string;
  note?: string;
};

export type PageContent = {
  slug: string;
  title: string;
  /** Shown in <title> and og:title when it should differ from `title`. */
  metaTitle?: string;
  metaDescription: string;
  intro?: string;
  body: string[];
  bullets?: string[];
};

export type BoardResult = {
  year: string;
  registered: number | null;
  passed: number | null;
  passPercentage: string;
  remarks?: string;
};

export type DisclosureDocument = {
  label: string;
  href: string;
  sizeBytes?: number;
};

export type DisclosureRow = { label: string; value: string };

export type StaffCounts = {
  principal: number;
  totalTeachers: number;
  pgt: number | null;
  tgt: number;
  prt: number;
  teacherSectionRatio: string;
  specialEducator: string;
  counsellor: string;
};

export type Infrastructure = {
  campusAreaSqm: number;
  classrooms: number;
  classroomAreaSqm: number;
  labs: number;
  labAreaSqm: number;
  internet: boolean;
};

export type Facility = {
  slug: string;
  title: string;
  summary: string;
  details: string[];
};

export type Circular = {
  title: string;
  date: string;
  summary?: string;
  href?: string;
  /** Drives the badge shown on the notice board. */
  kind: "circular" | "event" | "result" | "admission";
};

export type GalleryImage = {
  src: string;
  /** Required. Every image on the old site shipped without one. */
  alt: string;
  width?: number;
  height?: number;
};

export type GalleryAlbum = {
  slug: string;
  title: string;
  description?: string;
  images: GalleryImage[];
};

export type AdmissionStep = { step: number; title: string; detail: string };
