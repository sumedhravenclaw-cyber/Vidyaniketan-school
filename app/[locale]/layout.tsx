import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Mulish, Noto_Serif_Devanagari } from "next/font/google";
import "../globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { fullAddress } from "@/lib/content/school";
import { getSchool } from "@/lib/content";
import { locales, localeTags, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * A high-contrast transitional serif for headings, echoing the engraved
 * lettering on the school crest, over a warm humanist sans for body copy.
 * Noto Serif Devanagari carries the motto and all Marathi text.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoDeva = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-deva",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const BASE = "https://vidyaniketanchikhli.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const school = await getSchool(locale);

  const title =
    locale === "mr"
      ? school.name + " — चिखली, बुलढाणा येथील सीबीएसई शाळा"
      : school.name + " — CBSE School in Chikhli, Buldhana";

  const description =
    locale === "mr"
      ? "चिखली, बुलढाणा येथील इंग्रजी माध्यमाची सीबीएसई शाळा. स्थानिक मुलांना शिक्षणासाठी 25 किलोमीटरचा प्रवास करावा लागू नये म्हणून स्थापन. संलग्नता क्र. 1130688."
      : "An English-medium CBSE school in Chikhli, Buldhana, founded so that local children would not have to travel 25 km for their education. Affiliation no. 1130688.";

  return {
    metadataBase: new URL(BASE),
    title: { default: title, template: "%s — " + school.name },
    description,
    openGraph: {
      type: "website",
      locale: localeTags[locale].replace("-", "_"),
      siteName: school.name,
      title,
      description,
      url: BASE + "/" + locale,
      images: [
        {
          url: "/logo.jpg",
          width: 989,
          height: 989,
          alt: "Crest of " + school.name,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/" + locale,
      languages: {
        "en-IN": "/en",
        "mr-IN": "/mr",
        "x-default": "/en",
      },
    },
    robots: { index: true, follow: true },
  };
}

/** Machine-readable identity, so a branded search can build a proper panel. */
function structuredData(schoolName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: schoolName,
    alternateName: ["The Chikhli Urban Vidyaniketan", "दि चिखली अर्बन विद्यानिकेतन"],
    url: BASE,
    logo: BASE + "/logo.jpg",
    email: "chikhlividyaniketan2014@gmail.com",
    telephone: "+91 91684 58222",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Survey No. 218, Near Ranwara Hotel, Gupta Garden, Jafrabad Road",
      addressLocality: "Chikhli",
      addressRegion: "Maharashtra",
      postalCode: "443201",
      addressCountry: "IN",
    },
    identifier: [
      { "@type": "PropertyValue", name: "CBSE Affiliation Number", value: "1130688" },
      { "@type": "PropertyValue", name: "CBSE School Code", value: "30693" },
    ],
    sameAs: [
      "https://www.youtube.com/@thechikhliurbanvidyaniketa6474",
      "https://www.instagram.com/vidyaniketan_chikhli/",
    ],
    description: "CBSE-affiliated English-medium school at " + fullAddress() + ".",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const school = await getSchool(typedLocale);

  return (
    <html
      lang={localeTags[typedLocale]}
      className={`${playfair.variable} ${mulish.variable} ${notoDeva.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(school.name)) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-vermilion-500 focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.nav.skipToContent}
        </a>
        <SiteHeader locale={typedLocale} dict={dict} school={school} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={typedLocale} dict={dict} school={school} />
      </body>
    </html>
  );
}
