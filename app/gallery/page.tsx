import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { getGalleryAlbums } from "@/lib/content";
import { school } from "@/lib/content/school";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from events and everyday life at The Chikhli Urban Vidyaniketan, Chikhli, Buldhana.",
  openGraph: {
    title: "Gallery",
    description: "Photographs from The Chikhli Urban Vidyaniketan, Chikhli, Buldhana.",
  },
};

export default async function GalleryPage() {
  const albums = await getGalleryAlbums();
  const total = albums.reduce((n, a) => n + a.images.length, 0);

  return (
    <>
      <PageHero
        eyebrow="Life at school"
        title="Gallery"
        intro={total + " photographs from school events and everyday life on campus."}
        breadcrumb={[{ label: "Gallery", href: "/gallery" }]}
      />

      <Section>
        <div className="space-y-16">
          {albums.map((album) => (
            <section key={album.slug} aria-labelledby={"album-" + album.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2
                  id={"album-" + album.slug}
                  className="font-display text-2xl font-semibold text-navy-800"
                >
                  {album.title}
                </h2>
                <p className="text-sm text-ink-500">
                  {album.images.length}{" "}
                  {album.images.length === 1 ? "photograph" : "photographs"}
                </p>
              </div>

              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {album.images.map((img) => (
                  <li
                    key={img.src}
                    className="relative aspect-4/3 overflow-hidden rounded-lg bg-sand-200"
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

        <div className="mt-16 rounded-lg border border-sand-200 bg-white p-7">
          <h2 className="font-display text-xl font-semibold text-navy-800">Video</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
            The school publishes video from events, assemblies and celebrations on its own
            channels.
          </p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm">
            {school.social.youtube ? (
              <a
                href={school.social.youtube}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
              >
                YouTube channel
                <span className="sr-only">, opens in a new tab</span>
              </a>
            ) : null}
            {school.social.instagram ? (
              <a
                href={school.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
              >
                Instagram
                <span className="sr-only">, opens in a new tab</span>
              </a>
            ) : null}
          </div>
        </div>

        <p className="mt-8 text-sm text-ink-500">
          Looking for something specific?{" "}
          <Link
            href="/contact"
            className="font-semibold text-vermilion-600 underline-offset-4 hover:underline"
          >
            Contact the school office
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
