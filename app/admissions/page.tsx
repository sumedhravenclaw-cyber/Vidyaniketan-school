import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SectionHeading, EmptyState } from "@/components/ui";
import { school } from "@/lib/content/school";
import { academicDocuments } from "@/lib/content/disclosure";
import {
  admissionSteps,
  admissionContactNote,
  currentAdmissionCycle,
} from "@/lib/content/admissions";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "How to apply to The Chikhli Urban Vidyaniketan, a CBSE English-medium school in Chikhli, Buldhana. Contact the school office for forms, eligibility and current dates.",
  openGraph: {
    title: "Admissions",
    description:
      "How to apply to The Chikhli Urban Vidyaniketan, a CBSE school in Chikhli, Buldhana.",
  },
};

/**
 * The enquiry route is a plain mailto with the subject and body pre-filled.
 * It works on any host with no backend, no third-party form service, and no
 * personal data passing through anything the school does not already control.
 */
function enquiryMailto(): string {
  const subject = encodeURIComponent("Admission enquiry");
  const body = encodeURIComponent(
    [
      "Student's name:",
      "Class applying for:",
      "Parent / guardian name:",
      "Contact number:",
      "Present school (if any):",
      "",
      "Your question:",
      "",
    ].join("\n"),
  );
  return "mailto:" + school.email + "?subject=" + subject + "&body=" + body;
}

export default function AdmissionsPage() {
  const feeDoc = academicDocuments.find((d) => d.label.includes("Fee structure"));
  const calendarDoc = academicDocuments.find((d) => d.label.includes("calendar"));

  return (
    <>
      <PageHero
        eyebrow={currentAdmissionCycle ? "Admissions " + currentAdmissionCycle : "Admissions"}
        title="Joining the school"
        intro={admissionContactNote}
        breadcrumb={[{ label: "Admissions", href: "/admissions" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <SectionHeading title="How to apply" />
            <div className="mt-6">
              {admissionSteps.length > 0 ? (
                <ol className="space-y-6">
                  {admissionSteps.map((s) => (
                    <li key={s.step} className="flex gap-5">
                      <span
                        aria-hidden
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-vermilion-500 font-display text-sm font-semibold text-white"
                      >
                        {s.step}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-navy-800">
                          {s.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-600">
                          {s.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState title="Please contact the school office">
                  The admission process, eligibility criteria and this year&rsquo;s dates are
                  issued directly by the office. Call or write and they will confirm what
                  applies to your child&rsquo;s class.
                </EmptyState>
              )}
            </div>

            <div className="mt-10 rounded-lg border border-sand-200 bg-white p-7">
              <h3 className="font-display text-lg font-semibold text-navy-800">
                Documents you may be asked for
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                The school office will give you the full list when you enquire. The
                published fee structure and academic calendar are available below.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {feeDoc ? (
                  <li>
                    <a
                      href={feeDoc.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
                    >
                      Fee structure
                      <span className="sr-only">, opens in a new tab</span>
                    </a>
                  </li>
                ) : null}
                {calendarDoc ? (
                  <li>
                    <a
                      href={calendarDoc.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
                    >
                      Annual academic calendar
                      <span className="sr-only">, opens in a new tab</span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>

          <aside className="rounded-lg border border-sand-200 bg-white p-7">
            <h2 className="font-display text-xl font-semibold text-navy-800">
              Make an enquiry
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              The quickest route is a phone call during office hours. You can also send an
              email and the office will reply.
            </p>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-ink-500">Phone</dt>
                <dd className="mt-0.5">
                  <a
                    href={"tel:" + school.primaryPhone.replace(/\s/g, "")}
                    className="font-semibold text-navy-800 underline-offset-4 hover:underline"
                  >
                    {school.primaryPhone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-ink-500">Email</dt>
                <dd className="mt-0.5 break-all">
                  <a
                    href={"mailto:" + school.email}
                    className="font-semibold text-navy-800 underline-offset-4 hover:underline"
                  >
                    {school.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-ink-500">Office hours</dt>
                <dd className="mt-0.5 text-navy-800">{school.officeHours}</dd>
              </div>
            </dl>

            <a
              href={enquiryMailto()}
              className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-vermilion-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vermilion-600"
            >
              Start an email enquiry
            </a>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Opens your email app with the questions the office will ask already filled in.
            </p>

            <p className="mt-6 border-t border-sand-200 pt-5 text-sm text-ink-500">
              Prefer to visit?{" "}
              <Link
                href="/contact"
                className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
              >
                Directions and address
              </Link>
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
