import Link from "next/link";
import { Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section>
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-vermilion-600">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-navy-800 sm:text-4xl">
          We could not find that page
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-600">
          The link may be out of date. These are the pages people most often need:
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          {[
            { label: "Home", href: "/" },
            { label: "About the school", href: "/about" },
            { label: "Admissions", href: "/admissions" },
            { label: "Mandatory public disclosure", href: "/about/disclosure" },
            { label: "Contact us", href: "/contact" },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
