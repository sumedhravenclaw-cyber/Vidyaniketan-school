import Link from "next/link";
import type { ReactNode } from "react";

/** Standard page banner for every interior page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <div className="on-navy border-b border-navy-700 bg-navy-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-navy-200">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              {breadcrumb.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  <Link href={c.href} className="transition-colors hover:text-white">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100">{intro}</p>
        ) : null}
      </div>
    </div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={"mx-auto max-w-7xl px-4 py-14 sm:py-20 " + className}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-vermilion-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-3 text-base leading-relaxed text-ink-600">{intro}</p>
      ) : null}
    </div>
  );
}

/** Body copy shared by the ported content pages. */
export function Prose({ paragraphs, bullets }: { paragraphs?: string[]; bullets?: string[] }) {
  return (
    <div className="max-w-2xl">
      {paragraphs?.map((p, i) => (
        <p key={i} className="mb-4 text-base leading-relaxed text-ink-600 last:mb-0">
          {p}
        </p>
      ))}
      {bullets && bullets.length > 0 ? (
        <ul className="mt-2 space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-ink-600">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-vermilion-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function Cta({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "onDark";
}) {
  const styles = {
    primary:
      "bg-vermilion-500 text-white hover:bg-vermilion-600",
    secondary:
      "border border-navy-200 bg-white text-navy-800 hover:border-vermilion-500 hover:text-vermilion-600",
    onDark:
      "border border-navy-200/40 bg-white/10 text-white hover:bg-white hover:text-navy-800",
  }[variant];

  return (
    <Link
      href={href}
      className={
        "inline-flex items-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors " +
        styles
      }
    >
      {children}
    </Link>
  );
}

/**
 * Honest empty state. Used wherever the school has not published content yet —
 * better than inventing circulars or admission dates that parents would act on.
 */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-sand-200 bg-white p-8 text-center">
      <p className="font-display text-lg font-semibold text-navy-800">{title}</p>
      {children ? (
        <div className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
          {children}
        </div>
      ) : null}
    </div>
  );
}
