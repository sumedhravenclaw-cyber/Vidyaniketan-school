import type { BoardResult, DisclosureDocument, DisclosureRow } from "@/lib/types";
import { school, staff, infrastructure, fullAddress } from "@/lib/content/school";
import { schoolMr } from "@/lib/content/mr";
import type { Locale } from "@/lib/i18n/config";

/**
 * CBSE Mandatory Public Disclosure (Appendix IX).
 *
 * Row LABELS are translated, because they are just headings. The VALUES stay
 * exactly as filed with the Board — school name, address, principal's name and
 * qualification, certificate titles. Those are the record, and a Marathi
 * rendering of an English legal filing would not match the documents an
 * inspector or a parent is holding.
 *
 * Documents are still served from the existing WordPress uploads directory so
 * that nothing breaks during the migration. Once they are re-uploaded to the
 * CMS these hrefs become Sanity file URLs and this file goes away.
 *
 * All links are https — the originals were linked over plain http.
 */

const UPLOADS = "https://vidyaniketanchikhli.com/wp-content/uploads";
const mr = (locale: Locale) => locale === "mr";

export function generalInformationFor(locale: Locale): DisclosureRow[] {
  const isMr = mr(locale);
  return [
    {
      label: isMr ? "शाळेचे नाव" : "Name of the school",
      // Both scripts, because the crest and the CBSE filing differ.
      value: isMr ? schoolMr.name + " (" + school.name + ")" : school.name,
    },
    { label: isMr ? "संलग्नता क्रमांक" : "Affiliation number", value: school.affiliationNo },
    { label: isMr ? "शाळा संकेतांक" : "School code", value: school.schoolCode },
    {
      label: isMr ? "पिन कोडसह संपूर्ण पत्ता" : "Complete address with pin code",
      value: fullAddress(),
    },
    {
      label: isMr ? "मुख्याध्यापकांचे नाव व शैक्षणिक पात्रता" : "Principal name & qualification",
      value: "Gaurav Vandankumar Shete, M.Sc., B.Ed.",
    },
    { label: isMr ? "शाळेचा ईमेल" : "School email ID", value: school.email },
    { label: isMr ? "संपर्क क्रमांक" : "Contact details", value: school.primaryPhone },
  ];
}

export function statutoryDocumentsFor(locale: Locale): DisclosureDocument[] {
  const isMr = mr(locale);
  return [
    {
      label: isMr
        ? "संलग्नता / श्रेणीवाढ पत्र आणि संलग्नतेची अलीकडील मुदतवाढ"
        : "Affiliation / upgradation letter and recent extension of affiliation",
      href: UPLOADS + "/2024/04/Extension-Letter.pdf",
      sizeBytes: 294597,
    },
    {
      label: isMr
        ? "संस्था / ट्रस्ट / कंपनी नोंदणी अथवा नूतनीकरण प्रमाणपत्र"
        : "Society / trust / company registration or renewal certificate",
      href: UPLOADS + "/2024/04/Recognisation-Certificate.pdf",
      sizeBytes: 106500,
    },
    {
      label: isMr
        ? "राज्य शासनाने दिलेले ना-हरकत प्रमाणपत्र (एनओसी)"
        : "No Objection Certificate (NOC) issued by the State Government",
      href: UPLOADS + "/2024/04/NOC.pdf",
      sizeBytes: 407664,
    },
    {
      label: isMr
        ? "शिक्षण हक्क कायदा, 2009 अंतर्गत मान्यता प्रमाणपत्र"
        : "Recognition certificate under the RTE Act, 2009",
      href: UPLOADS + "/2024/04/RTE-Certificate.pdf",
      sizeBytes: 331929,
    },
    {
      label: isMr
        ? "राष्ट्रीय इमारत संहितेनुसार इमारत सुरक्षा प्रमाणपत्र"
        : "Building safety certificate as per the National Building Code",
      href: UPLOADS + "/2024/04/Building-Safety-1.pdf",
      sizeBytes: 141099,
    },
    {
      label: isMr
        ? "सक्षम प्राधिकाऱ्याने दिलेले अग्निसुरक्षा प्रमाणपत्र"
        : "Fire safety certificate issued by the competent authority",
      href: UPLOADS + "/2024/04/Fire-Safety-Certificate.pdf",
      sizeBytes: 1278796,
    },
    {
      label: isMr
        ? "शिक्षणाधिकारी प्रमाणपत्र / शाळेचे स्वयंप्रमाणपत्र"
        : "DEO certificate / self-certification by the school",
      href: UPLOADS + "/2024/04/Self-Certificate-with-Digital-Sign.pdf",
      sizeBytes: 335896,
    },
    {
      label: isMr
        ? "पाणी, आरोग्य व स्वच्छता प्रमाणपत्र"
        : "Water, health and sanitation certificate",
      href: UPLOADS + "/2024/04/Water-Safety.pdf",
      sizeBytes: 115144,
    },
    {
      label: isMr ? "सुरक्षित पिण्याच्या पाण्याचे प्रमाणपत्र" : "Safe drinking water certificate",
      href: UPLOADS + "/2024/02/Safe-Drinking-Water.pdf",
      sizeBytes: 231292,
    },
    {
      label: isMr ? "जमीन प्रमाणपत्र" : "Land certificate",
      href: UPLOADS + "/2024/04/Land-Certificate-1.pdf",
      sizeBytes: 153134,
    },
  ];
}

export function academicDocumentsFor(locale: Locale): DisclosureDocument[] {
  const isMr = mr(locale);
  return [
    {
      // FLAGGED: dated April 2024. Replace with the current fee structure.
      label: isMr ? "शाळेचे शुल्क तपशील" : "Fee structure of the school",
      href: UPLOADS + "/2024/04/Fee-Structure.pdf",
      sizeBytes: 149670,
    },
    {
      // FLAGGED: this is the 2024-25 calendar. Replace with the current one.
      label: isMr ? "वार्षिक शैक्षणिक दिनदर्शिका" : "Annual academic calendar",
      href: UPLOADS + "/2024/04/Annual-Calendar-2024-25.pdf",
      sizeBytes: 910066,
    },
    {
      label: isMr ? "शाळा व्यवस्थापन समिती (एसएमसी)" : "School Management Committee (SMC)",
      href: UPLOADS + "/2024/04/SMC.pdf",
      sizeBytes: 149104,
    },
    {
      label: isMr
        ? "पालक-शिक्षक संघ (पीटीए) सदस्य"
        : "Parent Teachers Association (PTA) members",
      href: UPLOADS + "/2024/04/PTA.pdf",
      sizeBytes: 149104,
    },
    {
      label: isMr ? "मंडळ परीक्षेचा निकाल" : "Result of the board examination",
      href: UPLOADS + "/2023/09/Class-X-Result-last-3-1.pdf",
      sizeBytes: 5873,
    },
    {
      label: isMr
        ? "अनिवार्य प्रकटीकरण तपशील (सारस 5.0)"
        : "Mandatory disclosure details (SARAS 5.0)",
      href: UPLOADS + "/2024/04/Mandatory-Disclosure-Details-_-SARAS-5.0-final.pdf",
      sizeBytes: 119005,
    },
  ];
}

export function staffAndTeachingFor(locale: Locale): DisclosureRow[] {
  const isMr = mr(locale);
  return [
    { label: isMr ? "मुख्याध्यापक" : "Principal", value: String(staff.principal) },
    { label: isMr ? "एकूण शिक्षक" : "Number of teachers", value: String(staff.totalTeachers) },
    { label: "PGT", value: staff.pgt === null ? "—" : String(staff.pgt) },
    { label: "TGT", value: String(staff.tgt) },
    { label: "PRT", value: String(staff.prt) },
    {
      label: isMr ? "शिक्षक / तुकडी प्रमाण" : "Teacher / section ratio",
      value: staff.teacherSectionRatio,
    },
    { label: isMr ? "विशेष शिक्षक" : "Special educator", value: staff.specialEducator },
    {
      label: isMr ? "समुपदेशक व स्वास्थ्य शिक्षक" : "Counsellor and wellness teacher",
      value: staff.counsellor,
    },
  ];
}

export function schoolInfrastructureFor(locale: Locale): DisclosureRow[] {
  const isMr = mr(locale);
  const sqm = isMr ? " चौ. मी." : " sq m";
  return [
    {
      label: isMr ? "एकूण परिसर क्षेत्रफळ" : "Total campus area",
      value: infrastructure.campusAreaSqm.toLocaleString("en-IN") + sqm,
    },
    {
      label: isMr ? "वर्गखोल्यांची संख्या व आकार" : "Number and size of classrooms",
      value: isMr
        ? infrastructure.classrooms +
          " खोल्या, " +
          infrastructure.classroomAreaSqm.toLocaleString("en-IN") +
          sqm
        : infrastructure.classrooms +
          " rooms, " +
          infrastructure.classroomAreaSqm.toLocaleString("en-IN") +
          sqm,
    },
    {
      label: isMr ? "प्रयोगशाळांची संख्या" : "Number of laboratories",
      value: isMr
        ? infrastructure.labs + " प्रयोगशाळा, " + infrastructure.labAreaSqm + sqm
        : infrastructure.labs + " labs, " + infrastructure.labAreaSqm + sqm,
    },
    {
      label: isMr ? "इंटरनेट सुविधा" : "Internet facility",
      value: infrastructure.internet ? (isMr ? "होय" : "Yes") : isMr ? "नाही" : "No",
    },
  ];
}

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

/** Remarks are data, but the only two values in use are translatable. */
export function remarkFor(remark: string | undefined, locale: Locale): string {
  if (!remark) return "—";
  if (locale === "mr" && remark === "All passed") return "सर्व उत्तीर्ण";
  return remark;
}

/** Every linked document, both sections, for link-checking and the sitemap. */
export function allDisclosureDocumentsFor(locale: Locale): DisclosureDocument[] {
  return [...statutoryDocumentsFor(locale), ...academicDocumentsFor(locale)];
}
