# The Chikhli Urban Vidyaniketan — website

A rebuild of [vidyaniketanchikhli.com](https://vidyaniketanchikhli.com) in Next.js,
structured along the lines of [littlerock.edu.in](https://littlerock.edu.in).

- **Next.js 16** (App Router, TypeScript, React 19)
- **Tailwind CSS v4** — theme tokens live in `app/globals.css`
- **Sanity** as the CMS, hosted separately from the site
- Deploys to **Vercel**

## Brand

The school crest lives at `public/logo.jpg` (989×989). It also sits at
`app/icon.jpg`, which is where Next generates the favicon from — keep the two in
sync if the crest is ever replaced.

The crest is a square image with the seal centred on white, so every placement
masks it with `rounded-full`; that trims the white corners exactly to the ring.
It appears in the header, the homepage hero, the footer, the browser tab,
and as `logo` in the `EducationalOrganization` JSON-LD.

Palette in `app/globals.css` is adopted from Little Rock Indian School
(littlerock.edu.in), sampled from its live stylesheet: `maroon-600` is `#7f0000`,
its header and nav bar; `gold-400` is `#ffd306`, its accent; `ink-900` `#26262c`
and `mist-100` `#f6f7fd` are its ink and section ground. `crimson-*` is the one
addition — a brighter, cooler red reserved for actions, because our buttons sit
on maroon-tinted imagery and a maroon footer where the chrome maroon would bury
them.

Type follows the same source: **Montserrat** alone, 400 to 700, with hierarchy
carried by weight and size rather than by a second face. It loads as a variable
font, so the whole range is one file. Montserrat has no Devanagari, so **Noto
Sans Devanagari** sits behind it in every stack and picks up the motto and all
Marathi text. Both are self-hosted through `next/font`, so there is no
render-blocking request to Google.

Three colours repeat as a **maroon / gold / crimson rule** in fixed proportions —
under the header, under every page banner, and mirrored above the footer. Gold
does the quieter work throughout: a hairline ring on the crest, a short underline
beneath every section heading, caps on cards and stat tiles, breadcrumb
separators, and list bullets.

Gold is decorative only — never an interactive colour, and never text on a light
ground below `gold-600`, which is the lightest step that holds 4.5:1. Links and
buttons stay crimson so "this is clickable" never depends on telling two warm
hues apart.

## Languages

English and Marathi, at `/en` and `/mr`. Marathi matters here: the school is in
Buldhana and it is the first language of most of the catchment.

- `lib/i18n/config.ts` — locales, BCP 47 tags, path helpers
- `lib/i18n/dictionaries.ts` — every interface string, both languages
- `lib/content/mr.ts` — the school's own content in Marathi
- `middleware.ts` — sends un-prefixed paths to a locale

A returning visitor keeps whatever they last chose (a `NEXT_LOCALE` cookie set by
the switcher). A first-time visitor gets what their browser asks for, so a
Marathi-configured phone lands on Marathi without touching anything. The URL is
always explicit afterwards, which is what makes each page shareable and
indexable. Both languages are prerendered, cross-linked with `hreflang`, and
listed in the sitemap with `x-default` pointing at English.

The switcher keeps you on the page you are reading — `/mr/about/disclosure`
switches to `/en/about/disclosure`, not back to the homepage.

**On the disclosure page, labels are translated but values are not.** School
name, address, principal's qualification and certificate titles stay exactly as
filed with CBSE — a Marathi rendering of an English legal filing would not match
the documents an inspector or a parent is holding. The school name appears in
both scripts on that page for the same reason.

> **The Marathi has not been reviewed by a native speaker.** It is a faithful
> translation of the English source, but someone at the school should read it
> before launch — particularly the statutory wording, which mirrors CBSE's
> Appendix IX.

---

## Running it

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000` with **no configuration and no CMS
account** — it serves built-in seed content ported from the existing site.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (24 static pages) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run studio` | Sanity Studio at `localhost:3333` |
| `npm run studio:deploy` | Publish the Studio to `<project>.sanity.studio` |

---

## How content works

Every page reads through `lib/content.ts`. That resolver asks Sanity first and
falls back to the seed files in `lib/content/` — on a missing project ID, an
empty result, or a failed query. **A CMS outage cannot take the site down**;
parents still get the address and the disclosure documents.

```
lib/content/     seed content, ported from the old site
lib/sanity/      read-only client + image URL builder
lib/content.ts   the resolver both feed into
sanity/schema.ts CMS document types, mirroring lib/types.ts
```

### Connecting the CMS

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) (free tier is enough).
2. Copy `.env.example` to `.env.local` and fill in the project ID.
3. `npm run studio` to author content, `npm run studio:deploy` to give staff a hosted URL.

Content added in the Studio takes over automatically. Nothing else changes.

### Why the Studio is not mounted at `/studio`

Embedding it would pull the `sanity` package and its CLI dependency tree —
which currently carries several advisories — into the deployed serverless
bundle. The site talks only to the read-only content API via `@sanity/client`.

`npm audit --omit=dev` reports **0 vulnerabilities**. The Studio tooling stays a
devDependency and never ships.

---

## What was fixed from the old site

| Old site | Now |
| --- | --- |
| `HOME` menu item 404'd on all 16 pages | Every nav href resolves; routes are typed in `components/nav-data.ts` |
| Email link missing `mailto:`, went to gmail.com | Correct `mailto:` in header, footer, admissions, contact |
| Lorem Ipsum, "IT Consultant", "0 Years Experience" live on the homepage | Gone. Real content only |
| "a **soiled** education … **bought** future" | "a solid education … a bright future" (corrections logged in `lib/content/pages.ts`) |
| 96 of 100 images had no alt text | Every image has alt text |
| No meta description on any page | Per-page metadata, plus Open Graph and `EducationalOrganization` JSON-LD |
| No `<h1>` on the homepage | One `h1` per page |
| Six empty pages published in the menu | Empty pages removed; unpublished sections show honest empty states |
| 1.9 MB of CSS across 20 stylesheets | Tailwind, compiled per route |
| Full-screen "LOADING" splash | None |
| Contact page had no map | OpenStreetMap embed — no API key, no consent banner |

---

## Content that still needs the school

These are **deliberately empty or flagged in code** rather than invented. Each is
marked with a comment where it lives.

1. **Admission process** (`lib/content/admissions.ts`) — no process, dates or
   eligibility criteria are published anywhere on the current site. A wrong date
   costs a family a school place, so the page shows a "contact the office" state.
2. **Circulars and events** (`lib/content/circulars.ts`) — nothing to port.
3. **Board results** stop at 2022-23, and registered/passed counts are blank for
   all three years. Rendered as `—`, never as a guessed number.
4. **Teacher counts don't reconcile** — the disclosure gives 77 total, but
   TGT 24 + PRT 46 = 70, and PGT is blank.
5. **Campus size conflicts** — "6 acre" on the features page vs 20,000 sq m
   (≈4.94 acres) on the disclosure. The disclosure figure is used throughout.
6. **Fee structure and academic calendar** PDFs are dated 2024.
7. **The About text** referred to "Credit Agree Goal, a subsidiary of yes Bank in
   Paris" — garbled at source, so the clause was dropped rather than guessed at.
8. **Gallery alt text** is generic (school + month). Whoever knows what is in
   each frame should replace it through the CMS.
9. **Map pin** is on Chikhli town, not surveyed to the building.

---

## Deploying to Vercel

1. Push to a Git remote and import the repo at [vercel.com/new](https://vercel.com/new).
2. Add the `NEXT_PUBLIC_SANITY_*` variables if the CMS is connected — the build
   succeeds without them.
3. Point `vidyaniketanchikhli.com` at Vercel.

The old site's URLs carried `/index.php/` (and `/about-us/` returned 404). If the
domain moves, add redirects in `next.config.ts` from the old paths so existing
links and search results keep working:

```ts
async redirects() {
  return [
    { source: "/index.php/about-us", destination: "/about", permanent: true },
    { source: "/index.php/mandatory-public-disclosure", destination: "/about/disclosure", permanent: true },
    // …one per old page
  ];
}
```

Media and the 16 CBSE PDFs are still served from the existing WordPress uploads
directory (`next.config.ts` allow-lists the host). Re-upload them to the CMS
before decommissioning that server.
