import type { GalleryAlbum } from "@/lib/types";

/**
 * Photographs ported from the existing site's gallery page.
 *
 * Two things changed in the move:
 *   1. Thumbnails were swapped for the full-size originals, which next/image
 *      then resizes properly. The old page served 300px crops stretched up.
 *   2. Every image now has alt text. All 49 on the old site had none.
 *
 * The alt text below states only what can be verified: the school, and the
 * month the photograph was uploaded. Whoever knows what is actually happening
 * in each frame should replace these with real descriptions through the CMS —
 * that is what makes a gallery searchable and screen-reader usable.
 */
export const galleryAlbums: GalleryAlbum[] = [
  {
    slug: "2019-08",
    title: "August 2019",
    description: "School photographs from August 2019.",
    images: [
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190825-WA0042.jpg", alt: "School photograph 1 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190825-WA0039.jpg", alt: "School photograph 2 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190825-WA0023.jpg", alt: "School photograph 3 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190825-WA0041.jpg", alt: "School photograph 4 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190825-WA0028.jpg", alt: "School photograph 5 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190825-WA0033.jpg", alt: "School photograph 6 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7252.jpg", alt: "School photograph 7 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7192.jpg", alt: "School photograph 8 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7203.jpg", alt: "School photograph 9 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7207.jpg", alt: "School photograph 10 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7193.jpg", alt: "School photograph 11 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7289.jpg", alt: "School photograph 12 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7284.jpg", alt: "School photograph 13 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7424.jpg", alt: "School photograph 14 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7426.jpg", alt: "School photograph 15 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7428.jpg", alt: "School photograph 16 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7429.jpg", alt: "School photograph 17 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF7313.jpg", alt: "School photograph 18 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/WhatsApp-Image-2019-07-19-at-3.51.39-PM1.jpeg", alt: "School photograph 19 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF6772.jpg", alt: "School photograph 20 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF6743.jpg", alt: "School photograph 21 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/WhatsApp-Image-2019-05-01-at-1.55.27-PM1.jpeg", alt: "School photograph 22 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190803-WA0066.jpg", alt: "School photograph 23 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190803-WA0012.jpg", alt: "School photograph 24 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/DSCF6199.jpg", alt: "School photograph 25 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190412-WA0013.jpg", alt: "School photograph 26 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190412-WA0014.jpg", alt: "School photograph 27 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190126-WA0020.jpg", alt: "School photograph 28 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190126-WA0030.jpg", alt: "School photograph 29 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190126-WA0021.jpg", alt: "School photograph 30 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG-20190126-WA0015.jpg", alt: "School photograph 31 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/SPORT-FESTIVAL-3.jpg", alt: "School photograph 32 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2019/08/IMG20181129112909.jpg", alt: "School photograph 33 of 33, The Chikhli Urban Vidyaniketan, August 2019" },
    ],
  },
  {
    slug: "2018-12",
    title: "December 2018",
    description: "School photographs from December 2018.",
    images: [
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/12/WhatsApp-Image-2018-10-22-at-10.28.06-AM.jpeg", alt: "School photograph 1 of 8, The Chikhli Urban Vidyaniketan, December 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/12/WhatsApp-Image-2018-10-22-at-10.28.07-AM.jpeg", alt: "School photograph 2 of 8, The Chikhli Urban Vidyaniketan, December 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/12/IMG_20181217_125624.jpg", alt: "School photograph 3 of 8, The Chikhli Urban Vidyaniketan, December 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/12/IMG_20181217_121833.jpg", alt: "School photograph 4 of 8, The Chikhli Urban Vidyaniketan, December 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/12/IMG_20181217_134618.jpg", alt: "School photograph 5 of 8, The Chikhli Urban Vidyaniketan, December 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/12/WhatsApp-Image-2018-12-22-at-1.33.12-PM.jpeg", alt: "School photograph 6 of 8, The Chikhli Urban Vidyaniketan, December 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/12/WhatsApp-Image-2018-12-22-at-1.33.09-PM.jpeg", alt: "School photograph 7 of 8, The Chikhli Urban Vidyaniketan, December 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/12/WhatsApp-Image-2018-12-22-at-1.33.09-PM-1.jpeg", alt: "School photograph 8 of 8, The Chikhli Urban Vidyaniketan, December 2018" },
    ],
  },
  {
    slug: "2018-11",
    title: "November 2018",
    description: "School photographs from November 2018.",
    images: [
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/11/IMG_8887.jpg", alt: "School photograph 1 of 4, The Chikhli Urban Vidyaniketan, November 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/11/IMG_8964.jpg", alt: "School photograph 2 of 4, The Chikhli Urban Vidyaniketan, November 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/11/IMG_8992.jpg", alt: "School photograph 3 of 4, The Chikhli Urban Vidyaniketan, November 2018" },
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/11/IMG_9020.jpg", alt: "School photograph 4 of 4, The Chikhli Urban Vidyaniketan, November 2018" },
    ],
  },
  {
    slug: "2018-09",
    title: "September 2018",
    description: "School photographs from September 2018.",
    images: [
      { src: "https://vidyaniketanchikhli.com/wp-content/uploads/2018/09/DSCF7521-1.jpg", alt: "School photograph 1 of 1, The Chikhli Urban Vidyaniketan, September 2018" },
    ],
  },
];

export const allGalleryImages = galleryAlbums.flatMap((a) => a.images);

export function findAlbum(slug: string): GalleryAlbum | undefined {
  return galleryAlbums.find((a) => a.slug === slug);
}

/** A small, stable selection for the homepage. */
export const featuredImages = allGalleryImages.slice(0, 8);
