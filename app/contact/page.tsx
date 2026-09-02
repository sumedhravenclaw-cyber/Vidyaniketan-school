import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { school, fullAddress } from "@/lib/content/school";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Address, phone, email and office hours for The Chikhli Urban Vidyaniketan, Jafrabad Road, Chikhli, Buldhana, Maharashtra 443201.",
  openGraph: {
    title: "Contact Us",
    description: "How to reach The Chikhli Urban Vidyaniketan, Chikhli, Buldhana.",
  },
};

/**
 * The map is an OpenStreetMap embed rather than Google Maps: it needs no API
 * key, sets no advertising cookies, and does not require a consent banner.
 * The old contact page had no map at all.
 */
const MAP_BBOX = "76.2350,20.3300,76.2750,20.3620";
const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=" +
  MAP_BBOX +
  "&layer=mapnik&marker=20.3460,76.2550";

export default function ContactPage() {
  const a = school.address;

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        intro="The school office is open Monday to Saturday."
        breadcrumb={[{ label: "Contact Us", href: "/contact" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading title="School office" />

            <dl className="mt-6 divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
              <div className="px-6 py-5">
                <dt className="text-sm text-ink-500">Address</dt>
                <dd className="mt-1 text-sm leading-relaxed text-navy-800">
                  {a.line1}
                  <br />
                  {a.line2}
                  <br />
                  {a.city}, Dist. {a.district}
                  <br />
                  {a.state} &ndash; {a.pin}
                </dd>
              </div>

              <div className="px-6 py-5">
                <dt className="text-sm text-ink-500">Phone</dt>
                <dd className="mt-1 text-sm">
                  <a
                    href={"tel:" + school.primaryPhone.replace(/\s/g, "")}
                    className="font-semibold text-navy-800 underline-offset-4 hover:underline"
                  >
                    {school.primaryPhone}
                  </a>
                </dd>
              </div>

              <div className="px-6 py-5">
                <dt className="text-sm text-ink-500">Email</dt>
                <dd className="mt-1 break-all text-sm">
                  <a
                    href={"mailto:" + school.email}
                    className="font-semibold text-navy-800 underline-offset-4 hover:underline"
                  >
                    {school.email}
                  </a>
                </dd>
              </div>

              <div className="px-6 py-5">
                <dt className="text-sm text-ink-500">Office hours</dt>
                <dd className="mt-1 text-sm text-navy-800">
                  {school.officeHours}
                  <br />
                  <span className="text-ink-500">Sunday closed</span>
                </dd>
              </div>

              <div className="px-6 py-5">
                <dt className="text-sm text-ink-500">CBSE</dt>
                <dd className="mt-1 text-sm tabular-nums text-navy-800">
                  Affiliation No. {school.affiliationNo}
                  <br />
                  School Code {school.schoolCode}
                </dd>
              </div>
            </dl>

            <a
              href={"mailto:" + school.email + "?subject=" + encodeURIComponent("Website enquiry")}
              className="mt-7 inline-flex items-center rounded-md bg-vermilion-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vermilion-600"
            >
              Email the school office
            </a>
          </div>

          <div>
            <SectionHeading title="Finding us" />
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-600">
              The campus is on Jafrabad Road in Chikhli, near Ranwara Hotel.
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-sand-200 bg-sand-100">
              <iframe
                title={"Map showing the location of " + school.name + " in Chikhli, Buldhana"}
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-96 w-full border-0"
              />
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Map data &copy; OpenStreetMap contributors. The marker is placed on Chikhli
              town; confirm the exact pin with the school office before setting it as a
              navigation destination.
            </p>

            <a
              href={
                "https://www.openstreetmap.org/search?query=" +
                encodeURIComponent(fullAddress())
              }
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-block text-sm font-semibold text-vermilion-600 underline-offset-4 hover:underline"
            >
              Open in maps
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
