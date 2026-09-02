import type { Infrastructure, SchoolProfile, Stat, StaffCounts } from "@/lib/types";

/**
 * Every value here was taken from the school's own published material:
 * the CBSE Mandatory Public Disclosure page and the site footer.
 *
 * Two figures are known to disagree with each other at source and are flagged
 * inline. They are reproduced as published rather than silently corrected —
 * the school needs to confirm which is right before this goes live.
 */

export const school: SchoolProfile = {
  name: "The Chikhli Urban Vidyaniketan",
  shortName: "Vidyaniketan",
  motto: {
    sanskrit: "ज्ञानेन लभ्यते सर्वम्",
    translation: "Through knowledge, all is attained",
  },
  tagline: "A solid education is the foundation of a bright future",
  affiliationNo: "1130688",
  schoolCode: "30693",
  board: "Central Board of Secondary Education (CBSE)",
  address: {
    line1: "Survey No. 218, Near Ranwara Hotel",
    line2: "Gupta Garden, Jafrabad Road",
    city: "Chikhli",
    district: "Buldhana",
    state: "Maharashtra",
    pin: "443201",
  },
  primaryPhone: "+91 91684 58222",
  altPhones: ["+91 89757 54928", "+91 70572 36523"],
  email: "chikhlividyaniketan2014@gmail.com",
  officeHours: "Monday – Saturday, 9:00 am – 5:00 pm",
  social: {
    youtube: "https://www.youtube.com/@thechikhliurbanvidyaniketa6474",
    instagram: "https://www.instagram.com/vidyaniketan_chikhli/",
  },
};

export const infrastructure: Infrastructure = {
  campusAreaSqm: 20000,
  classrooms: 56,
  classroomAreaSqm: 2601,
  labs: 6,
  labAreaSqm: 428,
  internet: true,
};

export const staff: StaffCounts = {
  principal: 1,
  // NOTE: the published disclosure gives 77 total, but the breakdown below
  // accounts for 70 and leaves PGT blank. Confirm before publishing.
  totalTeachers: 77,
  pgt: null,
  tgt: 24,
  prt: 46,
  teacherSectionRatio: "1.6",
  specialEducator: "Ratnamala Amol Gawai",
  counsellor: "Amol Panjabrao Gawai",
};

/** The counter row on the homepage. Only figures the school has published. */
export const headlineStats: Stat[] = [
  { label: "Campus area", value: 20000, suffix: " sq m" },
  { label: "Classrooms", value: 56 },
  { label: "Laboratories", value: 6 },
  { label: "Teaching staff", value: 77 },
];

export function fullAddress(): string {
  const a = school.address;
  return `${a.line1}, ${a.line2}, ${a.city}, Dist. ${a.district}, ${a.state} ${a.pin}`;
}
