import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { getGalleryAlbums, getSchool } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const description =
    locale === "mr"
      ? "दि चिखली अर्बन विद्यानिकेतन, चिखली, बुलढाणा येथील कार्यक्रम व दैनंदिन जीवनाची छायाचित्रे."
      : "Photographs from events and everyday life at The Chikhli Urban Vidyaniketan, Chikhli, Buldhana.";
  return {
    title: dict.nav.gallery,
    description,
    openGraph: { title: dict.nav.gallery, description },
    alternates: {
      canonical: "/" + locale + "/gallery",
      languages: { "en-IN": "/en/gallery", "mr-IN": "/mr/gallery" },
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [albums, school] = await Promise.all([getGalleryAlbums(locale), getSchool(locale)]);
  const total = albums.reduce((n, a) => n + a.images.length, 0);

  return (
    <>
      <PageHero
        eyebrow={dict.gallery.eyebrow}
        title={dict.nav.gallery}
        intro={total + " " + dict.gallery.intro}
        breadcrumb={[{ label: dict.nav.gallery, href: "/" + locale + "/gallery" }]}
        homeLabel={dict.nav.home}
        homeHref={"/" + locale}
        breadcrumbLabel={dict.nav.breadcrumbLabel}
      />

      <Section>
        <div className="space-y-16">
          {albums.map((album) => (
            <section key={album.slug} aria-labelledby={"album-" + album.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-gold-500 pb-3">
                <h2
                  id={"album-" + album.slug}
                  className="font-display text-2xl font-semibold text-maroon-800"
                >
                  {album.title}
                </h2>
                <p className="text-sm text-ink-500">
                  {album.images.length}{" "}
                  {album.images.length === 1
                    ? dict.common.photograph
                    : dict.common.photographs}
                </p>
              </div>

              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {album.images.map((img) => (
                  <li
                    key={img.src}
                    className="relative aspect-4/3 overflow-hidden rounded-lg bg-mist-200 ring-1 ring-gold-500/25"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-lg border border-mist-200 bg-white">
          <span aria-hidden className="block h-1 bg-crimson-500" />
          <div className="p-7">
            <h2 className="font-display text-xl font-semibold text-maroon-800">
              {dict.gallery.videoTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
              {dict.gallery.videoBody}
            </p>
            <div className="mt-5 flex flex-wrap gap-5 text-sm">
              {school.social.youtube ? (
                <a
                  href={school.social.youtube}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
                >
                  YouTube
                  <span className="sr-only">{dict.common.opensInNewTab}</span>
                </a>
              ) : null}
              {school.social.instagram ? (
                <a
                  href={school.social.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
                >
                  Instagram
                  <span className="sr-only">{dict.common.opensInNewTab}</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-ink-500">
          {dict.gallery.lookingFor}{" "}
          <Link
            href={"/" + locale + "/contact"}
            className="font-semibold text-crimson-600 underline-offset-4 hover:underline"
          >
            {dict.gallery.contactOffice}
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
