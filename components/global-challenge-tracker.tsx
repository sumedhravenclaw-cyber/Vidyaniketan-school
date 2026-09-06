"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================================
   Baseline figures.

   Every number here is a published estimate with a named source, because the
   point of the dashboard is data literacy — a student who asks "where did that
   number come from?" should be able to find the answer on the card itself.
   Update these once a year; the CO2 card refreshes itself from a live API.
============================================================================ */

/** Atmospheric CO2 before large-scale fossil fuel use. IPCC AR6, ~1750. */
const PRE_INDUSTRIAL_PPM = 280;

/**
 * Shown until (or unless) the live Mauna Loa feed answers. These mirror the
 * real September 2026 readings, so a student looking at the offline dashboard
 * is not looking at an invented number — just a slightly stale one.
 */
const FALLBACK_CO2 = {
  ppm: 423.9,
  trendPpm: 427.9,
  readingLabel: "September 2026",
  live: false,
};

/**
 * Crowther et al., "Mapping tree density at a global scale", Nature (2015)
 * estimated roughly 15.3 billion trees lost per year. Dividing by the seconds
 * in a year is what drives the ticker — it is an average spread evenly, NOT a
 * live satellite measurement, and the card says so out loud.
 */
const TREES_LOST_PER_YEAR = 15_300_000_000;
const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;
const TREES_LOST_PER_SECOND = TREES_LOST_PER_YEAR / SECONDS_PER_YEAR; // ~484.8

/** ESA Space Environment Report / public catalogues, 2025-26 approximations. */
const SPACE = {
  operationalSatellites: 13_300,
  trackedDebris: 36_500, // objects larger than 10 cm, tracked from the ground
  untrackedFragments: 1_200_000, // 1-10 cm: too small to track, big enough to destroy
};

/** Ember Global Electricity Review: renewables ≈ 32% of world electricity. */
const BASE_RENEWABLE_SHARE = 32.1;

/** Ember: power-sector CO2, in billions of tonnes per year. */
const POWER_SECTOR_GT_CO2 = 14.6;

const CO2_API = "https://global-warming.org/api/co2-api";

/**
 * Pinned locale. Server and client must format identically or React reports a
 * hydration mismatch on every digit that renders.
 */
const nf = new Intl.NumberFormat("en-US");
const nf1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/* ============================================================================
   Small hooks
============================================================================ */

/** Honours the OS "reduce motion" setting, and keeps honouring it if it changes. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Re-renders on an interval so time-derived numbers stay current.
 *
 * The interval only triggers a render — it never adds to a running total.
 * Accumulating (`total += rate`) drifts badly, because browsers throttle
 * background tabs to roughly one tick per second: leave the page open in
 * another tab for ten minutes and an accumulating counter comes back tens of
 * thousands of trees short. Deriving the value from the wall clock instead
 * means the number is right the moment the student looks back at it.
 */
function useClockTick(intervalMs: number, paused: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, paused]);

  return now;
}

function startOfYear(ts: number): number {
  return new Date(new Date(ts).getFullYear(), 0, 1).getTime();
}

/* ============================================================================
   Presentational pieces
============================================================================ */

function Card({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
        {eyebrow}
      </p>
      <h3 className="mb-4 text-lg font-bold leading-snug text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

/** A short "where this came from" line. Every card carries one. */
function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
      {children}
    </p>
  );
}

/* ============================================================================
   Card 1 — atmospheric CO2
============================================================================ */

type Co2State = typeof FALLBACK_CO2;

function Co2Card({ co2, status }: { co2: Co2State; status: "loading" | "live" | "fallback" }) {
  const excess = co2.ppm - PRE_INDUSTRIAL_PPM;
  const percentHigher = (excess / PRE_INDUSTRIAL_PPM) * 100;

  return (
    <Card eyebrow="Atmosphere" title="Carbon Dioxide in the Air">
      <div className="flex items-end gap-3">
        <p className="text-5xl font-bold tabular-nums tracking-tight text-blue-900">
          {nf1.format(co2.ppm)}
        </p>
        <p className="pb-2 text-lg font-semibold text-slate-500">PPM</p>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        <strong className="font-semibold text-slate-900">PPM means &ldquo;parts per million&rdquo;.</strong>{" "}
        Imagine counting out a million tiny marbles of air — about{" "}
        {Math.round(co2.ppm)} of them would be carbon dioxide.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-lg bg-blue-900 px-3 py-1.5 text-sm font-bold text-white">
          +{nf1.format(excess)} PPM above pre-industrial
        </span>
        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-900 ring-1 ring-blue-200">
          {nf1.format(percentHigher)}% higher than 1750
        </span>
      </div>

      <SourceNote>
        {status === "live" ? (
          <>
            <span className="font-semibold text-emerald-700">● Live</span> — Mauna Loa Observatory
            (NOAA), reading for {co2.readingLabel}. Seasonally adjusted trend:{" "}
            {nf1.format(co2.trendPpm)} PPM. Compared against {PRE_INDUSTRIAL_PPM} PPM, the
            pre-industrial level (IPCC).
          </>
        ) : status === "loading" ? (
          <>
            <span className="font-semibold text-slate-600">○ Checking for a live reading…</span>{" "}
            showing the most recent saved value ({co2.readingLabel}) in the meantime.
          </>
        ) : (
          <>
            <span className="font-semibold text-amber-700">○ Saved estimate</span> — the live
            feed could not be reached, so this shows the last recorded reading (
            {co2.readingLabel}, Mauna Loa / NOAA). The comparison still uses{" "}
            {PRE_INDUSTRIAL_PPM} PPM as the pre-industrial baseline.
          </>
        )}
      </SourceNote>
    </Card>
  );
}

/* ============================================================================
   Card 2 — tree loss ticker
============================================================================ */

function TreeCard({ now, sessionStart }: { now: number; sessionStart: number }) {
  const secondsThisYear = (now - startOfYear(now)) / 1000;
  const treesThisYear = Math.floor(secondsThisYear * TREES_LOST_PER_SECOND);
  const treesThisVisit = Math.floor(((now - sessionStart) / 1000) * TREES_LOST_PER_SECOND);
  const year = new Date(now).getFullYear();

  return (
    <Card eyebrow="Forests" title="Trees Lost Around the World">
      {/*
        suppressHydrationWarning: the server renders this a few milliseconds
        before the browser does, so the two numbers legitimately differ. The
        alternative — rendering a blank until mount — is the empty-state the
        dashboard is supposed to never show.
      */}
      <p
        suppressHydrationWarning
        aria-hidden="true"
        className="text-4xl font-bold tabular-nums tracking-tight text-emerald-800 sm:text-5xl"
      >
        {nf.format(treesThisYear)}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-600">so far in {year}</p>

      <div className="mt-4 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Since you opened this page
        </p>
        <p
          suppressHydrationWarning
          aria-hidden="true"
          className="mt-1 text-2xl font-bold tabular-nums text-emerald-900"
        >
          {nf.format(treesThisVisit)} trees
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        That works out to roughly{" "}
        <strong className="font-semibold text-slate-900">
          {Math.round(TREES_LOST_PER_SECOND)} trees every second
        </strong>{" "}
        — about the same as a small classroom of trees disappearing while you read this
        sentence.
      </p>

      <SourceNote>
        <strong className="font-semibold text-amber-700">This is an estimate, not a live
        measurement.</strong>{" "}
        Nobody counts trees in real time. It spreads the yearly figure of about 15.3 billion
        trees (Crowther et al., <em>Nature</em>, 2015) evenly across the year. Real
        deforestation happens in bursts, so treat this as a sense of scale rather than an exact
        count.
      </SourceNote>
    </Card>
  );
}

/* ============================================================================
   Card 3 — satellites and space debris
============================================================================ */

function SpaceCard() {
  const [showWhy, setShowWhy] = useState(false);
  const junkRatio = SPACE.trackedDebris / SPACE.operationalSatellites;

  return (
    <Card eyebrow="Orbit" title="Satellites and Space Junk">
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <dt className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            Working satellites
          </dt>
          <dd className="mt-1 text-3xl font-bold tabular-nums text-blue-900">
            {nf.format(SPACE.operationalSatellites)}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-100 p-4 ring-1 ring-slate-200">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Tracked junk
          </dt>
          <dd className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
            {nf.format(SPACE.trackedDebris)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 rounded-lg bg-blue-900 px-3 py-2 text-sm font-bold text-white">
        About {nf1.format(junkRatio)} pieces of junk for every working satellite.
      </p>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Those are only the pieces big enough to see from the ground. Roughly{" "}
        {nf.format(SPACE.untrackedFragments)} more fragments between 1 and 10 cm are too small
        to track — and at orbital speed, a 1 cm bolt hits with the force of a small
        explosion.
      </p>

      <button
        type="button"
        onClick={() => setShowWhy((v) => !v)}
        aria-expanded={showWhy}
        aria-controls="space-why"
        className="mt-4 self-start rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        {showWhy ? "Hide explanation" : "Why is this a problem?"}
      </button>

      <div
        id="space-why"
        hidden={!showWhy}
        className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-slate-700 ring-1 ring-amber-200"
      >
        <p className="mb-2 font-bold text-amber-900">The runaway collision problem</p>
        <p>
          When two objects collide in orbit they do not simply stop — they shatter into
          thousands of new fragments, each one moving fast enough to smash something else.
          Scientists call this chain reaction the{" "}
          <strong className="font-semibold">Kessler syndrome</strong>, after the NASA
          researcher Donald Kessler who described it in 1978.
        </p>
        <p className="mt-2">
          If it ever took hold, the busiest orbits could fill with debris faster than it falls
          away, making them unusable for weather satellites, GPS, internet, and crewed
          missions — possibly for generations. That is why space agencies now require new
          satellites to be de-orbited within 5 years of finishing their work.
        </p>
      </div>

      <SourceNote>
        Approximate counts based on ESA&apos;s Space Environment Report and public tracking
        catalogues (2025&ndash;26). The exact totals shift every week as satellites launch,
        break up, and burn up on re-entry.
      </SourceNote>
    </Card>
  );
}

/* ============================================================================
   Card 4 — renewable share, with a what-if simulator
============================================================================ */

function RenewableCard() {
  const [share, setShare] = useState(BASE_RENEWABLE_SHARE);

  const add = useCallback((points: number) => {
    setShare((s) => Math.min(100, Math.round((s + points) * 10) / 10));
  }, []);

  const reset = useCallback(() => setShare(BASE_RENEWABLE_SHARE), []);

  /*
    A deliberately simple model, spelled out on the card so students can argue
    with it: emissions from electricity are treated as proportional to the
    share of power that is NOT renewable. Real grids are messier — storage,
    nuclear, and gas backup all matter — but the direction and rough size of
    the effect are right.
  */
  const baseNonRenewable = 100 - BASE_RENEWABLE_SHARE;
  const nonRenewable = 100 - share;
  const emissions = POWER_SECTOR_GT_CO2 * (nonRenewable / baseNonRenewable);
  const avoided = POWER_SECTOR_GT_CO2 - emissions;
  const changed = share !== BASE_RENEWABLE_SHARE;

  return (
    <Card eyebrow="Energy" title="Electricity from Renewable Sources">
      <div className="flex items-end gap-3">
        <p className="text-5xl font-bold tabular-nums tracking-tight text-emerald-700">
          {nf1.format(share)}%
        </p>
        {changed && (
          <p className="pb-2 text-sm font-semibold text-emerald-700">
            (real figure today: {nf1.format(BASE_RENEWABLE_SHARE)}%)
          </p>
        )}
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(share)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Share of world electricity from renewable sources"
        className="mt-3 h-5 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${share}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">Solar, wind, hydro, and geothermal combined.</p>

      <div className="mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <p className="text-sm font-bold text-slate-900">What if we used more clean energy?</p>
        <p className="mt-1 text-xs text-slate-600">
          Press a button to imagine a cleaner grid and watch the emissions bar shrink.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => add(5)}
            disabled={share >= 100}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            + 5%
          </button>
          <button
            type="button"
            onClick={() => add(10)}
            disabled={share >= 100}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            + 10%
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={!changed}
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-300 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Reset
          </button>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Yearly CO₂ from making electricity
        </p>
        <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-900 transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${(emissions / POWER_SECTOR_GT_CO2) * 100}%` }}
          />
        </div>

        <p aria-live="polite" className="mt-2 text-sm text-slate-700">
          <strong className="font-bold tabular-nums text-slate-900">
            {nf1.format(emissions)} billion tonnes
          </strong>{" "}
          per year
          {avoided > 0.05 && (
            <>
              {" "}
              &mdash;{" "}
              <span className="font-bold text-emerald-700">
                {nf1.format(avoided)} billion tonnes avoided
              </span>
            </>
          )}
          .
        </p>
      </div>

      <SourceNote>
        Renewable share and power-sector emissions ({POWER_SECTOR_GT_CO2} billion tonnes of CO₂ a
        year) from Ember&apos;s Global Electricity Review. The simulator assumes emissions fall
        in step with the share of electricity that is not renewable &mdash; a simplification
        worth discussing in class, since real grids also need storage and backup.
      </SourceNote>
    </Card>
  );
}

/* ============================================================================
   Dashboard
============================================================================ */

export default function GlobalChallengeTracker({
  showIntro = true,
}: {
  /**
   * Set false when the surrounding page already supplies a heading (a
   * `PageHero`, say) — otherwise the page shows two titles for one section.
   */
  showIntro?: boolean;
} = {}) {
  const reducedMotion = useReducedMotion();

  const [co2, setCo2] = useState<Co2State>(FALLBACK_CO2);
  const [status, setStatus] = useState<"loading" | "live" | "fallback">("loading");

  // Fixed at mount so the "since you opened this page" counter has an anchor.
  const sessionStart = useRef(Date.now());

  /*
    100 ms as asked. Under "reduce motion" it drops to once a second: the value
    stays just as correct (it is read from the clock, not accumulated) while the
    digits stop flickering for students who find that uncomfortable.
  */
  const now = useClockTick(reducedMotion ? 1000 : 100, false);

  useEffect(() => {
    const controller = new AbortController();

    // Without this, a hanging request would leave the card saying "checking…"
    // indefinitely. Eight seconds, then fall back to the saved reading.
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    async function loadCo2() {
      try {
        const res = await fetch(CO2_API, { signal: controller.signal });
        if (!res.ok) throw new Error(`CO2 API responded ${res.status}`);

        const json: unknown = await res.json();
        const rows = (json as { co2?: unknown }).co2;
        if (!Array.isArray(rows) || rows.length === 0) throw new Error("CO2 API returned no rows");

        const last = rows[rows.length - 1] as Record<string, string | undefined>;
        const ppm = Number(last.cycle);
        const trend = Number(last.trend);

        // A malformed row must not blank the card, so sanity-check the range
        // before trusting it. Anything outside 300-600 PPM is a broken feed,
        // not a climate emergency.
        if (!Number.isFinite(ppm) || ppm < 300 || ppm > 600) {
          throw new Error(`CO2 API returned an implausible value: ${last.cycle}`);
        }

        const label = new Date(
          Number(last.year),
          Number(last.month) - 1,
          Number(last.day)
        ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

        setCo2({
          ppm,
          trendPpm: Number.isFinite(trend) ? trend : FALLBACK_CO2.trendPpm,
          readingLabel: label,
          live: true,
        });
        setStatus("live");
      } catch {
        // Any failure at all — offline, CORS, rate limit, bad JSON, timeout —
        // lands here, and the card keeps the realistic saved reading it was
        // born with. Nothing empties, nothing throws, the tickers keep running.
        setStatus("fallback");
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadCo2();

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const treesThisYear = Math.floor(
    ((now - startOfYear(now)) / 1000) * TREES_LOST_PER_SECOND
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      {showIntro ? (
      <header className="mb-8 rounded-2xl bg-blue-900 px-6 py-8 text-white sm:px-10 sm:py-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          Global Awareness
        </p>
        <h2 className="text-2xl font-bold leading-tight sm:text-4xl">
          Global Challenge &amp; Climate Tracker
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-100 sm:text-base">
          Four numbers that describe the planet our students are inheriting. Some update live,
          some are careful estimates &mdash; and each card tells you which it is, so you can
          practise asking where a number came from before you believe it.
        </p>
      </header>
      ) : null}

      {/*
        The fast ticker is deliberately hidden from screen readers (aria-hidden
        on the digits). A polite live region announcing ten times a second would
        make the page unusable with a screen reader. This region carries the same
        information, refreshed at a human pace instead.
      */}
      <p aria-live="polite" className="sr-only">
        Estimated trees lost worldwide this year: about {nf.format(Math.round(treesThisYear / 1_000_000))}{" "}
        million.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <Co2Card co2={co2} status={status} />
        <TreeCard now={now} sessionStart={sessionStart.current} />
        <SpaceCard />
        <RenewableCard />
      </div>

      <p className="mt-8 rounded-xl bg-slate-100 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <strong className="font-bold text-slate-900">How to read this dashboard:</strong> a
        counter that moves is not the same as a measurement that is being taken. The CO₂ card
        reports real readings from an observatory in Hawaii. The tree counter is one published
        yearly estimate divided evenly across the seconds in a year. Knowing the difference is
        the skill worth taking away from this page.
      </p>
    </div>
  );
}
