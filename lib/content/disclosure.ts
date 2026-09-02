import type { BoardResult, DisclosureDocument, DisclosureRow } from "@/lib/types";
import { school, staff, infrastructure, fullAddress } from "@/lib/content/school";

/**
 * CBSE Mandatory Public Disclosure (Appendix IX).
 *
 * Documents are still served from the existing WordPress uploads directory so
 * that nothing breaks during the migration. Once they are re-uploaded to the
 * CMS these hrefs become Sanity file URLs and this file goes away.
 *
 * All links are https — the originals were linked over plain http.
 */

const UPLOADS = "https://vidyaniketanchikhli.com/wp-content/uploads";

export const generalInformation: DisclosureRow[] = [
  { label: "Name of the school", value: school.name },
  { label: "Affiliation number", value: school.affiliationNo },
  { label: "School code", value: school.schoolCode },
  { label: "Complete address with pin code", value: fullAddress() },
  { label: "Principal name & qualification", value: "Gaurav Vandankumar Shete, M.Sc., B.Ed." },
  { label: "School email ID", value: school.email },
  { label: "Contact details", value: school.primaryPhone },
];

export const statutoryDocuments: DisclosureDocument[] = [
  {
    label: "Affiliation / upgradation letter and recent extension of affiliation",
    href: `${UPLOADS}/2024/04/Extension-Letter.pdf`,
    sizeBytes: 294597,
  },
  {
    label: "Society / trust / company registration or renewal certificate",
    href: `${UPLOADS}/2024/04/Recognisation-Certificate.pdf`,
    sizeBytes: 106500,
  },
  {
    label: "No Objection Certificate (NOC) issued by the State Government",
    href: `${UPLOADS}/2024/04/NOC.pdf`,
    sizeBytes: 407664,
  },
  {
    label: "Recognition certificate under the RTE Act, 2009",
    href: `${UPLOADS}/2024/04/RTE-Certificate.pdf`,
    sizeBytes: 331929,
  },
  {
    label: "Building safety certificate as per the National Building Code",
    href: `${UPLOADS}/2024/04/Building-Safety-1.pdf`,
    sizeBytes: 141099,
  },
  {
    label: "Fire safety certificate issued by the competent authority",
    href: `${UPLOADS}/2024/04/Fire-Safety-Certificate.pdf`,
    sizeBytes: 1278796,
  },
  {
    label: "DEO certificate / self-certification by the school",
    href: `${UPLOADS}/2024/04/Self-Certificate-with-Digital-Sign.pdf`,
    sizeBytes: 335896,
  },
  {
    label: "Water, health and sanitation certificate",
    href: `${UPLOADS}/2024/04/Water-Safety.pdf`,
    sizeBytes: 115144,
  },
  {
    label: "Safe drinking water certificate",
    href: `${UPLOADS}/2024/02/Safe-Drinking-Water.pdf`,
    sizeBytes: 231292,
  },
  {
    label: "Land certificate",
    href: `${UPLOADS}/2024/04/Land-Certificate-1.pdf`,
    sizeBytes: 153134,
  },
];

export const academicDocuments: DisclosureDocument[] = [
  {
    // FLAGGED: dated April 2024. Replace with the current fee structure.
    label: "Fee structure of the school",
    href: `${UPLOADS}/2024/04/Fee-Structure.pdf`,
    sizeBytes: 149670,
  },
  {
    // FLAGGED: this is the 2024-25 calendar. Replace with the current one.
    label: "Annual academic calendar",
    href: `${UPLOADS}/2024/04/Annual-Calendar-2024-25.pdf`,
    sizeBytes: 910066,
  },
  {
    label: "School Management Committee (SMC)",
    href: `${UPLOADS}/2024/04/SMC.pdf`,
    sizeBytes: 149104,
  },
  {
    label: "Parent Teachers Association (PTA) members",
    href: `${UPLOADS}/2024/04/PTA.pdf`,
    sizeBytes: 149104,
  },
  {
    label: "Result of the board examination",
    href: `${UPLOADS}/2023/09/Class-X-Result-last-3-1.pdf`,
    sizeBytes: 5873,
  },
  {
    label: "Mandatory disclosure details (SARAS 5.0)",
    href: `${UPLOADS}/2024/04/Mandatory-Disclosure-Details-_-SARAS-5.0-final.pdf`,
    sizeBytes: 119005,
  },
];

/**
 * FLAGGED: the published table stops at 2022-23 and leaves the registered and
 * passed counts blank for every year. Both gaps are reproduced faithfully —
 * `null` renders as an em dash rather than a fabricated number.
 */
export const classXResults: BoardResult[] = [
  { year: "2022-23", registered: null, passed: null, passPercentage: "92.15%" },
  { year: "2021-22", registered: null, passed: null, passPercentage: "100%", remarks: "All passed" },
  { year: "2020-21", registered: null, passed: null, passPercentage: "100%", remarks: "All passed" },
];

export const staffAndTeaching: DisclosureRow[] = [
  { label: "Principal", value: String(staff.principal) },
  { label: "Number of teachers", value: String(staff.totalTeachers) },
  { label: "PGT", value: staff.pgt === null ? "—" : String(staff.pgt) },
  { label: "TGT", value: String(staff.tgt) },
  { label: "PRT", value: String(staff.prt) },
  { label: "Teacher / section ratio", value: staff.teacherSectionRatio },
  { label: "Special educator", value: staff.specialEducator },
  { label: "Counsellor and wellness teacher", value: staff.counsellor },
];

export const schoolInfrastructure: DisclosureRow[] = [
  { label: "Total campus area", value: `${infrastructure.campusAreaSqm.toLocaleString("en-IN")} sq m` },
  {
    label: "Number and size of classrooms",
    value: `${infrastructure.classrooms} rooms, ${infrastructure.classroomAreaSqm.toLocaleString("en-IN")} sq m`,
  },
  {
    label: "Number of laboratories",
    value: `${infrastructure.labs} labs, ${infrastructure.labAreaSqm} sq m`,
  },
  { label: "Internet facility", value: infrastructure.internet ? "Yes" : "No" },
];

export const allDisclosureDocuments = [...statutoryDocuments, ...academicDocuments];
