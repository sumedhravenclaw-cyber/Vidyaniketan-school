import type { MetadataRoute } from "next";
import { contentPages } from "@/lib/content/pages";
import { facilities } from "@/lib/content/facilities";

const BASE = "https://vidyaniketanchikhli.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.9 },
    { path: "/about/disclosure", priority: 0.9 },
    { path: "/about/results", priority: 0.8 },
    { path: "/facilities", priority: 0.8 },
    { path: "/admissions", priority: 0.9 },
    { path: "/circulars", priority: 0.7 },
    { path: "/gallery", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
  ];

  const aboutRoutes = contentPages
    .filter((p) => p.slug !== "about")
    .map((p) => ({ path: "/about/" + p.slug, priority: 0.6 }));

  const facilityRoutes = facilities.map((f) => ({
    path: "/facilities/" + f.slug,
    priority: 0.6,
  }));

  return [...staticRoutes, ...aboutRoutes, ...facilityRoutes].map((r) => ({
    url: BASE + r.path,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}
