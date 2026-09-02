import type { MetadataRoute } from "next";
import { contentPages } from "@/lib/content/pages";
import { facilities } from "@/lib/content/facilities";
import { locales } from "@/lib/i18n/config";

const BASE = "https://vidyaniketanchikhli.com";

/**
 * Both languages are listed, and each entry declares the other as an alternate
 * so search engines pair them rather than treating Marathi as duplicate content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const paths = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.9 },
    { path: "/about/disclosure", priority: 0.9 },
    { path: "/about/results", priority: 0.8 },
    { path: "/facilities", priority: 0.8 },
    { path: "/admissions", priority: 0.9 },
    { path: "/circulars", priority: 0.7 },
    { path: "/gallery", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    ...contentPages
      .filter((p) => p.slug !== "about")
      .map((p) => ({ path: "/about/" + p.slug, priority: 0.6 })),
    ...facilities.map((f) => ({ path: "/facilities/" + f.slug, priority: 0.6 })),
  ];

  return locales.flatMap((locale) =>
    paths.map((r) => ({
      url: BASE + "/" + locale + r.path,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l === "en" ? "en-IN" : "mr-IN", BASE + "/" + l + r.path]),
        ),
      },
    })),
  );
}
