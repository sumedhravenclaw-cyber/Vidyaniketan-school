import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SectionHeading, EmptyState } from "@/components/ui";
import { academicDocumentsFor } from "@/lib/content/disclosure";
import { admissionSteps, currentAdmissionCycle } from "@/lib/content/admissions";
import { getSchool } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const description =
    locale === "mr"
      ? "चिखली, बुलढाणा येथील सीबीएसई इंग्रजी माध्यमाच्या दि चिखली अर्बन विद्यानिकेतनमध्ये प्रवेश कसा घ्यावा. अर्ज, पात्रता व तारखांसाठी शाळेच्या कार्यालयाशी संपर्क साधा."
      : "How to apply to The Chikhli Urban Vidyaniketan, a CBSE English-medium school in Chikhli, Buldhana. Contact the school office for forms, eligibility and current dates.";
  return {
    title: dict.nav.admissions,
    description,
    openGraph: { title: dict.nav.admissions, description },
    alternates: {
      canonical: "/" + locale + "/admissions",
      languages: { "en-IN": "/en/admissions", "mr-IN": "/mr/admissions" },
    },
  };
}

/**
 * The enquiry route is a plain mailto with the subject and body pre-filled.
 * It works on any host with no backend, no third-party form service, and no
 * personal data passing through anything the school does not already control.
 */
function enquiryMailto(email: string, locale: Locale): string {
  const subject = encodeURIComponent(
    locale === "mr" ? "प्रवेशाबाबत चौकशी" : "Admission enquiry",
  );
  const fields =
    locale === "mr"
      ? [
          "विद्यार्थ्याचे नाव:",
          "कोणत्या इयत्तेसाठी:",
          "पालकाचे नाव:",
          "संपर्क क्रमांक:",
          "सध्याची शाळा (असल्यास):",
          "",
          "आपला प्रश्न:",
          "",
        ]
      : [
          "Student's name:",
          "Class applying for:",
          "Parent / guardian name:",
          "Contact number:",
          "Present school (if any):",
          "",
          "Your question:",
          "",
        ];
  return "mailto:" + email + "?subject=" + subject + "&body=" + encodeURIComponent(fields.join("\n"));
}

export default async function AdmissionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const school = await getSchool(locale);
  const a = dict.admissions;

  // Keyed on the file URL, which does not change with locale — matching on the
  // label would break the moment the Marathi wording is edited.
  const docs = academicDocumentsFor(locale);
  const feeDoc = docs.find((d) => d.href.includes("Fee-Structure"));
  const calendarDoc = docs.find((d) => d.href.includes("Annual-Calendar"));

  return (
    <>
      <PageHero
        eyebrow={
          currentAdmissionCycle
            ? dict.nav.admissions + " " + currentAdmissionCycle
            : dict.nav.admissions
        }
        title={a.title}
        intro={a.contactOfficeBody}
        breadcrumb={[{ label: dict.nav.admissions, href: "/" + locale + "/admissions" }]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <SectionHeading title={a.howToApply} />
            <div className="mt-6">
              {admissionSteps.length > 0 ? (
                <ol className="space-y-6">
                  {admissionSteps.map((s) => (
                    <li key={s.step} className="flex gap-5">
                      <span
                        aria-hidden
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-crimson-500 font-display text-sm font-semibold text-white ring-2 ring-gold-500/50"
                      >
                        {s.step}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-maroon-800">
                          {s.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState title={a.contactOffice}>{a.contactOfficeBody}</EmptyState>
              )}
            </div>

            <div className="mt-10 overflow-hidden rounded-lg border border-mist-200 bg-white">
              <span aria-hidden className="block h-1 bg-gold-500" />
              <div className="p-7">
                <h3 className="font-display text-lg font-semibold text-maroon-800">
                  {a.documentsTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{a.documentsBody}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {feeDoc ? (
                    <li>
                      <a
                        href={feeDoc.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
                      >
                        {a.feeStructure}
                        <span className="sr-only">{dict.common.opensInNewTab}</span>
                      </a>
                    </li>
                  ) : null}
                  {calendarDoc ? (
                    <li>
                      <a
                        href={calendarDoc.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
                      >
                        {a.academicCalendar}
                        <span className="sr-only">{dict.common.opensInNewTab}</span>
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>

          <aside className="overflow-hidden rounded-lg border border-mist-200 bg-white">
            <span aria-hidden className="block h-1 bg-crimson-500" />
            <div className="p-7">
              <h2 className="font-display text-xl font-semibold text-maroon-800">
                {a.makeEnquiry}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{a.enquiryBody}</p>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-ink-500">{dict.common.phone}</dt>
                  <dd className="mt-0.5">
                    <a
                      href={"tel:" + school.primaryPhone.replace(/\s/g, "")}
                      className="font-semibold text-maroon-800 underline-offset-4 hover:underline"
                    >
                      {school.primaryPhone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-500">{dict.common.email}</dt>
                  <dd className="mt-0.5 break-all">
                    <a
                      href={"mailto:" + school.email}
                      className="font-semibold text-maroon-800 underline-offset-4 hover:underline"
                    >
                      {school.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-500">{dict.common.officeHours}</dt>
                  <dd className="mt-0.5 text-maroon-800">{school.officeHours}</dd>
                </div>
              </dl>

              <a
                href={enquiryMailto(school.email, locale)}
                className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-crimson-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-600"
              >
                {a.startEmail}
              </a>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">{a.startEmailNote}</p>

              <p className="mt-6 border-t border-mist-200 pt-5 text-sm text-ink-500">
                {a.preferVisit}{" "}
                <Link
                  href={"/" + locale + "/contact"}
                  className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
                >
                  {a.directions}
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
