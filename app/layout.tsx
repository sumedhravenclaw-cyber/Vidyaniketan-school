import type { Metadata } from "next";
import { Fraunces, Karla, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { school, fullAddress } from "@/lib/content/school";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const notoDeva = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-deva",
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vidyaniketanchikhli.com"),
  title: {
    default: `${school.name} — CBSE School in Chikhli, Buldhana`,
    // Page titles read "Admissions — The Chikhli Urban Vidyaniketan".
    // The old site doubled the school name into both halves.
    template: `%s — ${school.name}`,
  },
  description:
    "An English-medium CBSE school in Chikhli, Buldhana, founded so that local children would not have to travel 25 km for their education. Affiliation no. 1130688.",
  keywords: [
    "CBSE school Chikhli",
    "English medium school Buldhana",
    "Vidyaniketan Chikhli",
    "school admission Chikhli",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: school.name,
    title: `${school.name} — CBSE School in Chikhli, Buldhana`,
    description:
      "An English-medium CBSE school in Chikhli, Buldhana. Affiliation no. 1130688.",
    url: "https://vidyaniketanchikhli.com",
    images: [
      {
        // Real photograph of the school building, from the existing site.
        url: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/09/Building-Photo.jpg",
        width: 1200,
        height: 630,
        alt: `The ${school.name} school building, Jafrabad Road, Chikhli`,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

/** Machine-readable identity, so a branded search can build a proper panel. */
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: school.name,
    alternateName: "CUV Chikhli",
    url: "https://vidyaniketanchikhli.com",
    email: school.email,
    telephone: school.primaryPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${school.address.line1}, ${school.address.line2}`,
      addressLocality: school.address.city,
      addressRegion: school.address.state,
      postalCode: school.address.pin,
      addressCountry: "IN",
    },
    identifier: [
      { "@type": "PropertyValue", name: "CBSE Affiliation Number", value: school.affiliationNo },
      { "@type": "PropertyValue", name: "CBSE School Code", value: school.schoolCode },
    ],
    sameAs: [school.social.youtube, school.social.instagram].filter(Boolean),
    description: `CBSE-affiliated English-medium school at ${fullAddress()}.`,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${karla.variable} ${notoDeva.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-vermilion-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
