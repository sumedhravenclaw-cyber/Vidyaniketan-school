export type NavItem = { label: string; href: string; children?: NavItem[] };

/**
 * Every href below resolves to a real route. The old site shipped two menu
 * items pointing at deleted page IDs, both of which returned 404 on all
 * sixteen pages of the site.
 */
export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About the School", href: "/about" },
      { label: "Vision", href: "/about/vision" },
      { label: "Mission", href: "/about/mission" },
      { label: "Aims", href: "/about/aims" },
      { label: "Objectives", href: "/about/objectives" },
      { label: "What Makes Us Different", href: "/about/unique-features" },
      { label: "CBSE Results", href: "/about/results" },
      { label: "Mandatory Public Disclosure", href: "/about/disclosure" },
    ],
  },
  {
    label: "Facilities",
    href: "/facilities",
    children: [
      { label: "All Facilities", href: "/facilities" },
      { label: "Classrooms", href: "/facilities/classrooms" },
      { label: "Laboratories", href: "/facilities/laboratories" },
      { label: "Sports & Games", href: "/facilities/sports" },
      { label: "Transport", href: "/facilities/transport" },
      { label: "The Campus", href: "/facilities/campus" },
      { label: "Curriculum & Academics", href: "/facilities/academics" },
    ],
  },
  { label: "Admissions", href: "/admissions" },
  { label: "Circulars & Events", href: "/circulars" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];
