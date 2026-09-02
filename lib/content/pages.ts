import type { PageContent } from "@/lib/types";

/**
 * Ported from the existing site, with spelling and grammar corrected.
 *
 * Corrections applied — each is a wording fix only, no change of meaning:
 *   "soiled education … bought future"  → "solid education … bright future"
 *   "CBSC school"                       → "CBSE school"
 *   "the word of future"                → "the world of the future"
 *   "I am here to lean"                 → "I am here to learn"
 *   "obiendance"                        → "obedience"
 *   "install self confidence"           → "instil self-confidence"
 *   "use it jud"                        → "use it judiciously" (source text was cut off)
 *
 * FLAGGED FOR THE SCHOOL — do not publish until confirmed:
 *   1. The About text refers to "Credit Agree Goal, a subsidiary of yes Bank in
 *      Paris". The name appears garbled at source; the clause is omitted below
 *      rather than guessed at. Restore it once the correct name is known.
 *   2. Campus size is given as "6 acre" on the features page but 20,000 sq m
 *      (≈4.94 acres) on the CBSE disclosure. The disclosure figure is used
 *      site-wide; the features page no longer repeats a conflicting number.
 */

export const aboutPage: PageContent = {
  slug: "about",
  title: "About the School",
  metaDescription:
    "The Chikhli Urban Vidyaniketan is a CBSE English-medium school in Chikhli, Buldhana, founded so that local children would not have to travel 25 km for their education.",
  intro:
    "A solid education is the foundation of a bright future — and until this school opened, children in Chikhli were travelling 25 kilometres to reach one.",
  body: [
    "Between four and five hundred students from Chikhli were making a daily journey of 25 kilometres to attend school. The nearest CBSE English-medium school was in Buldhana, and for young children that travel was long, tiring and discouraging.",
    "The residents of Chikhli decided to act. Employees, directors and local advisory members of the Chikhli Urban Co-operative Bank came together and pooled their resources, establishing a multi-faceted organisation to undertake social projects, education foremost among them.",
    "They surveyed people across every section of local society to establish what would most improve the education of the next generation. The Chikhli Urban Vidyaniketan was founded to close that gap and to give the young people of Chikhli the opportunities and facilities their families wanted for them.",
    "The school provides the comfort, warmth and care that a child needs in order to learn.",
  ],
};

export const visionPage: PageContent = {
  slug: "vision",
  title: "Vision",
  metaDescription:
    "To make quality education a reality in Chikhli and to prepare the next generation for the world of the future.",
  body: [
    "To make quality education a reality in Chikhli, to prepare the next generation for the world of the future, and to embody the core values of hope, respect, responsibility, courage, justice, compassion, integrity and wisdom.",
  ],
};

export const missionPage: PageContent = {
  slug: "mission",
  title: "Mission",
  metaDescription:
    "The pledge every student of The Chikhli Urban Vidyaniketan makes: to respect, to co-operate, and to build a positive learning environment.",
  intro: "I am here to learn. Therefore I will —",
  body: [],
  bullets: [
    "Respect myself, others and the environment.",
    "Co-operate with all school personnel.",
    "Build an environment of positive learning and teaching.",
  ],
};

export const aimsPage: PageContent = {
  slug: "aims",
  title: "Aims",
  metaDescription:
    "The Vidyaniketan aims at imparting quality education for the development of the entire personality of the child.",
  body: [
    "The Vidyaniketan aims at imparting quality education for the development of the entire personality of the child, so as to make an ideal citizen.",
  ],
};

export const objectivesPage: PageContent = {
  slug: "objectives",
  title: "Objectives",
  metaDescription:
    "The objectives through which The Chikhli Urban Vidyaniketan pursues its aims — physical, intellectual, social and moral development.",
  intro: "The main objectives through which we pursue these aims are —",
  body: [],
  bullets: [
    "To build a good physique by developing good health habits.",
    "To provide all-round scope for the growth and development of the mind.",
    "To develop an attitude of respect and obedience towards elders, and a sense of self-respect.",
    "To enable students to understand themselves better, and to instil self-confidence in them.",
    "To help them develop positive attitudes and skills that will benefit their society and their nation.",
    "To inculcate a love of art, and of all that is good and pure.",
    "To create and develop a positive regard for labour.",
    "To make them value their freedom and use it judiciously.",
  ],
};

export const uniqueFeaturesPage: PageContent = {
  slug: "unique-features",
  title: "What Makes Us Different",
  metaDescription:
    "Research-based curriculum, a maximum of 40 children per class, digital classrooms, a green campus, and equal emphasis on academics, sport and Indian culture.",
  body: [],
  bullets: [
    "Research-based curriculum drawing on XSEED and NCERT.",
    "A maximum of 40 children in a class.",
    "An ideal student–teacher ratio.",
    "Digital classrooms using Next Education technology.",
    "Abacus activity to strengthen mathematical development.",
    "A calm, unhurried learning atmosphere on a green, pollution-free campus.",
    "Well-ventilated, airy classrooms.",
    "Equal emphasis on academics, sport, Indian culture and value systems.",
    "Pick-up and drop transport facility.",
    "Large playgrounds and an indoor games hall.",
    "An Olympic-size swimming pool.",
  ],
};

export const contentPages: PageContent[] = [
  aboutPage,
  visionPage,
  missionPage,
  aimsPage,
  objectivesPage,
  uniqueFeaturesPage,
];

export function findPage(slug: string): PageContent | undefined {
  return contentPages.find((p) => p.slug === slug);
}
