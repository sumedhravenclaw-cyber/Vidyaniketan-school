import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/**
 * The CMS is optional. Until a project ID is configured the site serves its
 * built-in seed content, so the whole thing builds and runs with no account.
 */
export const isCmsConfigured = Boolean(projectId);

let cached: SanityClient | null = null;

export function sanityClient(): SanityClient | null {
  if (!projectId) return null;
  if (!cached) {
    cached = createClient({
      projectId,
      dataset,
      apiVersion,
      // Published content only, served from the CDN.
      useCdn: true,
      perspective: "published",
    });
  }
  return cached;
}

/**
 * Fetch from Sanity, falling back to seed content on any failure.
 *
 * A CMS outage or a malformed query should never take the school's website
 * down — parents still need the address and the disclosure documents.
 */
export async function fetchOrFallback<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  const client = sanityClient();
  if (!client) return fallback;

  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate: 300 },
    });
    if (result === null || result === undefined) return fallback;
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result;
  } catch (error) {
    console.error("[sanity] query failed, serving seed content:", error);
    return fallback;
  }
}
