import type { Dictionary } from "@/lib/i18n/dictionaries";

export type NavItem = { label: string; href: string; children?: NavItem[] };

/**
 * Built per locale so both the labels and the hrefs are translated/prefixed
 * together. Every href resolves to a real route — the old site shipped two menu
 * items pointing at deleted page IDs, both of which returned 404 on all sixteen
 * pages of the site.
 */
export function buildNavigation(locale: string, dict: Dictionary): NavItem[] {
  const p = (path: string) => "/" + locale + (path === "/" ? "" : path);
  const n = dict.nav;

  return [
    { label: n.home, href: p("/") },
    {
      label: n.about,
      href: p("/about"),
      children: [
        { label: n.aboutSchool, href: p("/about") },
        { label: n.vision, href: p("/about/vision") },
        { label: n.mission, href: p("/about/mission") },
        { label: n.aims, href: p("/about/aims") },
        { label: n.objectives, href: p("/about/objectives") },
        { label: n.uniqueFeatures, href: p("/about/unique-features") },
        { label: n.results, href: p("/about/results") },
        { label: n.disclosure, href: p("/about/disclosure") },
      ],
    },
    {
      label: n.facilities,
      href: p("/facilities"),
      children: [
        { label: n.allFacilities, href: p("/facilities") },
        { label: dict.home.classrooms, href: p("/facilities/classrooms") },
        { label: dict.home.laboratories, href: p("/facilities/laboratories") },
        { label: locale === "mr" ? "क्रीडा व खेळ" : "Sports & Games", href: p("/facilities/sports") },
        { label: locale === "mr" ? "वाहतूक" : "Transport", href: p("/facilities/transport") },
        { label: locale === "mr" ? "परिसर" : "The Campus", href: p("/facilities/campus") },
        {
          label: locale === "mr" ? "अभ्यासक्रम व शैक्षणिक" : "Curriculum & Academics",
          href: p("/facilities/academics"),
        },
      ],
    },
    { label: n.admissions, href: p("/admissions") },
    { label: n.circulars, href: p("/circulars") },
    { label: n.gallery, href: p("/gallery") },
    { label: n.contact, href: p("/contact") },
  ];
}
