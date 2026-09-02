import Link from "next/link";
import type { ReactNode } from "react";

/** Standard page banner for every interior page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumb,
  homeLabel = "Home",
  homeHref = "/",
  breadcrumbLabel = "Breadcrumb",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  breadcrumb?: { label: string; href: string }[];
  homeLabel?: string;
  homeHref?: string;
  breadcrumbLabel?: string;
}) {
  return (
    <div className="on-navy relative bg-navy-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav aria-label={breadcrumbLabel} className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-navy-200">
              <li>
                <Link href={homeHref} className="transition-colors hover:text-white">
                  {homeLabel}
                </Link>
              </li>
              {breadcrumb.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden className="text-gold-500">
                    /
                  </span>
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
        <span aria-hidden className="mt-4 block h-0.5 w-16 bg-gold-500" />
        {intro ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100">{intro}</p>
        ) : null}
      </div>

      {/* Crest colours close the banner, matching the header rule. */}
      <div aria-hidden className="flex h-1">
        <span className="w-1/2 bg-navy-600" />
        <span className="w-1/4 bg-gold-500" />
        <span className="w-1/4 bg-vermilion-500" />
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
      <span aria-hidden className="mt-3 block h-0.5 w-12 bg-gold-500" />
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
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
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
    primary: "bg-vermilion-500 text-white hover:bg-vermilion-600",
    secondary:
      "border border-navy-200 bg-white text-navy-800 hover:border-gold-500 hover:text-vermilion-600",
    onDark:
      "border border-gold-500/50 bg-white/10 text-white hover:bg-gold-500 hover:text-navy-900",
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
    <div className="rounded-lg border border-dashed border-gold-500/40 bg-white p-8 text-center">
      <p className="font-display text-lg font-semibold text-navy-800">{title}</p>
      {children ? (
        <div className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
          {children}
        </div>
      ) : null}
    </div>
  );
}
