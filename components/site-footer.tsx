import Link from "next/link";
import { school } from "@/lib/content/school";

const quickLinks = [
  { label: "About the School", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Mandatory Public Disclosure", href: "/about/disclosure" },
  { label: "CBSE Results", href: "/about/results" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

export default function SiteFooter() {
  const a = school.address;

  return (
    <footer className="on-navy mt-24 bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="deva text-lg text-gold-400">{school.motto.sanskrit}</p>
          <p className="mt-1 text-sm text-navy-200">{school.motto.translation}</p>
          <h2 className="mt-5 font-display text-xl font-semibold text-white">
            {school.name}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy-200">
            An English-medium school affiliated to the {school.board}, founded so that
            the children of Chikhli would not have to travel 25 kilometres for their
            education.
          </p>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">Quick links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-navy-200 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">Contact</h3>
          <address className="mt-4 space-y-3 text-sm not-italic text-navy-200">
            <p className="leading-relaxed">
              {a.line1}
              <br />
              {a.line2}
              <br />
              {a.city}, Dist. {a.district}
              <br />
              {a.state} &ndash; {a.pin}
            </p>
            <p>
              <a
                className="transition-colors hover:text-white"
                href={"tel:" + school.primaryPhone.replace(/\s/g, "")}
              >
                {school.primaryPhone}
              </a>
            </p>
            <p>
              <a
                className="break-all transition-colors hover:text-white"
                href={"mailto:" + school.email}
              >
                {school.email}
              </a>
            </p>
            <p className="text-navy-200">{school.officeHours}</p>
            <p className="text-navy-200">Sunday closed</p>
          </address>

          <div className="mt-5 flex gap-4 text-sm">
            {school.social.instagram ? (
              <a
                href={school.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="text-navy-200 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Instagram
              </a>
            ) : null}
            {school.social.youtube ? (
              <a
                href={school.social.youtube}
                target="_blank"
                rel="noreferrer noopener"
                className="text-navy-200 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                YouTube
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-navy-700">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-navy-200">
          <p>
            &copy; {new Date().getFullYear()} {school.name}. All rights reserved.
          </p>
          <p>
            CBSE Affiliation No. {school.affiliationNo} &middot; School Code{" "}
            {school.schoolCode}
          </p>
        </div>
      </div>
    </footer>
  );
}
