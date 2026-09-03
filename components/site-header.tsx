"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buildNavigation, type NavItem } from "@/components/nav-data";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { locales, localeNames, stripLocale, type Locale } from "@/lib/i18n/config";
import type { SchoolProfile } from "@/lib/types";

function isActive(pathname: string, item: NavItem): boolean {
  const here = stripLocale(pathname);
  const there = stripLocale(item.href);
  if (there === "/") return here === "/";
  return here === there || here.startsWith(there + "/");
}

/**
 * Language switcher. Keeps the visitor on the page they are already reading and
 * remembers the choice, so the middleware does not send them back next visit.
 */
function LanguageSwitcher({
  locale,
  dict,
  className = "",
}: {
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  const pathname = usePathname();
  const rest = stripLocale(pathname);

  function remember(next: Locale) {
    // One year, site-wide. Read by middleware.ts on the next un-prefixed visit.
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className={"flex items-center gap-1 " + className}>
      <span className="sr-only">{dict.nav.languageLabel}</span>
      {locales.map((l, i) => {
        const active = l === locale;
        return (
          <span key={l} className="flex items-center">
            {i > 0 ? (
              <span aria-hidden className="mx-1 text-maroon-200/50">
                |
              </span>
            ) : null}
            <Link
              href={"/" + l + (rest === "/" ? "" : rest)}
              hrefLang={l}
              onClick={() => remember(l)}
              aria-current={active ? "true" : undefined}
              className={
                "rounded px-1.5 py-0.5 transition-colors " +
                (active
                  ? "font-semibold text-gold-400"
                  : "text-maroon-100 hover:text-white")
              }
            >
              {localeNames[l].native}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export default function SiteHeader({
  locale,
  dict,
  school,
}: {
  locale: Locale;
  dict: Dictionary;
  school: SchoolProfile;
}) {
  const pathname = usePathname();
  const navigation = buildNavigation(locale, dict);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-mist-50/95 backdrop-blur">
      {/* Utility bar — the brand maroon, with its gold on the motto. */}
      <div className="on-maroon bg-maroon-600 text-maroon-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-[13px]">
          <p className="flex items-center gap-2">
            <span className="deva text-gold-400">{school.motto.sanskrit}</span>
            <span className="hidden text-maroon-200 sm:inline">
              &mdash; {school.motto.translation}
            </span>
          </p>
          <div className="flex items-center gap-x-5">
            <a
              className="hidden hover:text-white sm:inline"
              href={"tel:" + school.primaryPhone.replace(/\s/g, "")}
            >
              {school.primaryPhone}
            </a>
            <LanguageSwitcher locale={locale} dict={dict} />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href={"/" + locale} className="flex items-center gap-3">
          {/* Square crest, seal centred: a circular mask trims the white
              corners exactly to the ring, and a gold hairline picks up the
              laurel inside it. */}
          <Image
            src="/logo.jpg"
            alt=""
            aria-hidden
            width={112}
            height={112}
            priority
            className="h-12 w-12 shrink-0 rounded-full ring-2 ring-gold-500/50 sm:h-14 sm:w-14"
          />
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-maroon-800 sm:text-lg">
              {school.name}
            </span>
            <span className="block text-xs text-ink-500">
              {dict.common.affiliationNo} {school.affiliationNo} &middot;{" "}
              {school.address.city}, {school.address.district}
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="rounded border border-mist-200 px-3 py-2 text-sm font-medium text-maroon-800 lg:hidden"
        >
          {mobileOpen ? dict.nav.close : dict.nav.menu}
        </button>

        <nav ref={navRef} aria-label={dict.nav.mainNavLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const active = isActive(pathname, item);
              const open = openMenu === item.label;

              if (!item.children) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={
                        "block rounded px-3 py-2 text-sm font-medium transition-colors " +
                        (active
                          ? "text-crimson-600"
                          : "text-maroon-800 hover:text-crimson-600")
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(open ? null : item.label)}
                    aria-expanded={open}
                    className={
                      "flex items-center gap-1 rounded px-3 py-2 text-sm font-medium transition-colors " +
                      (active
                        ? "text-crimson-600"
                        : "text-maroon-800 hover:text-crimson-600")
                    }
                  >
                    {item.label}
                    <span aria-hidden className="text-[10px]">
                      &#9662;
                    </span>
                  </button>
                  {open ? (
                    <ul className="absolute left-0 top-full z-50 min-w-64 overflow-hidden rounded-md border border-mist-200 bg-white shadow-lg">
                      {/* Gold cap ties the dropdown back to the brand rule. */}
                      <li aria-hidden className="h-0.5 bg-gold-500" />
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={
                              "block px-4 py-2 text-sm transition-colors hover:bg-mist-100 " +
                              (stripLocale(pathname) === stripLocale(child.href)
                                ? "font-medium text-crimson-600"
                                : "text-ink-600")
                            }
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          aria-label={dict.nav.mainNavLabel}
          className="border-t border-mist-200 bg-white lg:hidden"
        >
          <ul className="mx-auto max-w-7xl divide-y divide-mist-100 px-4 py-2">
            {navigation.map((item) => (
              <li key={item.label} className="py-2">
                <Link
                  href={item.href}
                  className={
                    "block text-sm font-medium " +
                    (isActive(pathname, item) ? "text-crimson-600" : "text-maroon-800")
                  }
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="mt-1 space-y-1 border-l-2 border-gold-500/40 pl-4">
                    {item.children.slice(1).map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block py-1 text-sm text-ink-500">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {/* The three brand colours, in fixed proportions, as the header rule. */}
      <div aria-hidden className="flex h-1">
        <span className="w-1/2 bg-maroon-600" />
        <span className="w-1/4 bg-gold-500" />
        <span className="w-1/4 bg-crimson-500" />
      </div>
    </header>
  );
}
