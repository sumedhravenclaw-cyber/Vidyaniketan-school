import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";

/**
 * Resolve a Sanity image reference to a URL.
 * Returns null when the CMS is not configured, so callers fall back to
 * whatever `src` their seed content already carries.
 */
export function urlForImage(source: unknown, width?: number): string | null {
  const client = sanityClient();
  if (!client || !source) return null;
  try {
    let builder = imageUrlBuilder(client).image(source as never).auto("format").fit("max");
    if (width) builder = builder.width(width);
    return builder.url();
  } catch {
    return null;
  }
}
