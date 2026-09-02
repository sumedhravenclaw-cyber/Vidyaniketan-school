"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, type NavItem } from "@/components/nav-data";
import { school } from "@/lib/content/school";

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close the desktop dropdown on an outside click, and everything on Escape.
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

  // Navigating away should always close both menus.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur">
      <div className="on-navy bg-navy-800 text-navy-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-[13px]">
          <p className="flex items-center gap-2">
            <span className="deva text-gold-400">{school.motto.sanskrit}</span>
            <span className="hidden text-navy-200 sm:inline">
              &mdash; {school.motto.translation}
            </span>
          </p>
          <div className="flex items-center gap-x-5">
            <a
              className="hover:text-white"
              href={"tel:" + school.primaryPhone.replace(/\s/g, "")}
            >
              {school.primaryPhone}
            </a>
            {/* The old site linked this without mailto:, sending visitors to gmail.com. */}
            <a
              className="hidden hover:text-white sm:inline"
              href={"mailto:" + school.email}
            >
              {school.email}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-vermilion-500 font-display text-lg font-semibold text-white"
          >
            CUV
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-navy-800 sm:text-lg">
              {school.name}
            </span>
            <span className="block text-xs text-ink-500">
              CBSE Affiliation No. {school.affiliationNo} &middot; Chikhli, Buldhana
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="rounded border border-sand-200 px-3 py-2 text-sm font-medium text-navy-800 lg:hidden"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>

        <nav ref={navRef} aria-label="Main" className="hidden lg:block">
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
                          ? "text-vermilion-600"
                          : "text-navy-800 hover:text-vermilion-600")
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
                        ? "text-vermilion-600"
                        : "text-navy-800 hover:text-vermilion-600")
                    }
                  >
                    {item.label}
                    <span aria-hidden className="text-[10px]">
                      &#9662;
                    </span>
                  </button>
                  {open ? (
                    <ul className="absolute left-0 top-full z-50 min-w-64 rounded-md border border-sand-200 bg-white py-2 shadow-lg">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={
                              "block px-4 py-2 text-sm transition-colors hover:bg-sand-100 " +
                              (pathname === child.href
                                ? "font-medium text-vermilion-600"
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
          aria-label="Main"
          className="border-t border-sand-200 bg-white lg:hidden"
        >
          <ul className="mx-auto max-w-7xl divide-y divide-sand-100 px-4 py-2">
            {navigation.map((item) => (
              <li key={item.label} className="py-2">
                <Link
                  href={item.href}
                  className={
                    "block text-sm font-medium " +
                    (isActive(pathname, item) ? "text-vermilion-600" : "text-navy-800")
                  }
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="mt-1 space-y-1 pl-4">
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
    </header>
  );
}
