import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity-hosted media, once the CMS is connected.
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Photographs still served from the existing WordPress site while content is migrated.
      { protocol: "https", hostname: "vidyaniketanchikhli.com" },
    ],
  },
};

export default nextConfig;
