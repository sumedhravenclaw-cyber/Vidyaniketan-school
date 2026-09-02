import type { Facility } from "@/lib/types";

/**
 * Every facility below is drawn from the school's own published material —
 * the "Unique features" page and the CBSE disclosure. Nothing here is invented.
 * Photographs and longer descriptions are added through the CMS.
 */
export const facilities: Facility[] = [
  {
    slug: "classrooms",
    title: "Classrooms",
    summary: "56 well-ventilated classrooms, capped at 40 children each.",
    details: [
      "The school has 56 classrooms across a total of 2,601 square metres.",
      "Class sizes are capped at a maximum of 40 children, supporting the close student–teacher ratio the school is built around.",
      "Rooms are well ventilated and airy, and are equipped with Next Education digital classroom technology.",
    ],
  },
  {
    slug: "laboratories",
    title: "Laboratories",
    summary: "Six laboratories, including computer labs, across 428 square metres.",
    details: [
      "Six laboratories occupy 428 square metres of the campus.",
      "The campus has internet connectivity throughout.",
    ],
  },
  {
    slug: "sports",
    title: "Sports & Games",
    summary: "Large playgrounds, an indoor games hall, and an Olympic-size swimming pool.",
    details: [
      "The school places equal emphasis on academics and sport.",
      "Facilities include large playgrounds, an indoor games hall, and an Olympic-size swimming pool.",
    ],
  },
  {
    slug: "transport",
    title: "Transport",
    summary: "Pick-up and drop facility serving Chikhli and the surrounding area.",
    details: [
      "The school runs a pick-up and drop facility.",
      "The school was founded precisely so that children would not have to travel 25 kilometres to Buldhana for a CBSE English-medium education.",
    ],
  },
  {
    slug: "campus",
    title: "The Campus",
    summary: "A 20,000 square metre green, pollution-free campus on Jafrabad Road.",
    details: [
      "The campus covers 20,000 square metres on Jafrabad Road, Chikhli.",
      "It is a green, pollution-free site, planned around a calm and unhurried learning atmosphere.",
    ],
  },
  {
    slug: "academics",
    title: "Curriculum & Academics",
    summary: "A research-based curriculum drawing on XSEED and NCERT.",
    details: [
      "The curriculum is research-based, drawing on both XSEED and NCERT.",
      "Abacus activity supports mathematical development.",
      "Equal emphasis is placed on academics, sport, Indian culture and value systems.",
    ],
  },
];

export function findFacility(slug: string): Facility | undefined {
  return facilities.find((f) => f.slug === slug);
}
