"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================================
   Time Travel Timeline

   A timeline of eras that opens into a full-screen "scene" for each one. Every
   scene is drawn with plain elements, gradients and clip-paths — no images, no
   canvas — so it costs nothing to load and scales to any screen.

   The immersive view is a native <dialog>. That is deliberate: it gives focus
   trapping, Escape-to-close, top-layer stacking and an inert background for
   free, and hand-rolled overlays usually get at least one of those wrong.
============================================================================ */

type Hotspot = {
  id: string;
  /** Accessible name — what a screen reader announces for the marker. */
  label: string;
  /** Position within the scene, in per cent, so it scales with the viewport. */
  x: number;
  y: number;
  title: string;
  body: string;
};

type Era = {
  id: string;
  title: string;
  year: string;
  summary: string;
  /** Short line shown as the scene loads, to set the mood. */
  narrative: string;
  /** Tailwind classes for the timeline node's accent. */
  nodeClass: string;
  hotspots: Hotspot[];
};

const ERAS: Era[] = [
  {
    id: "egypt",
    title: "Ancient Egypt",
    year: "3100 BCE",
    summary:
      "The Nile floods every year and leaves black soil behind. Along its banks, one of the world's first kingdoms takes shape.",
    narrative:
      "The sun climbs over the river. Stone dust hangs in the air, and the great tombs are still being built.",
    nodeClass: "from-amber-200 to-amber-400",
    hotspots: [
      {
        id: "eg-1",
        label: "The great pyramid",
        x: 26,
        y: 62,
        title: "Building without machines",
        body: "Workers moved stone blocks weighing as much as a car using ramps, sledges and water poured on the sand to cut friction. They were paid labourers and farmers, not enslaved people as films often show.",
      },
      {
        id: "eg-2",
        label: "The River Nile",
        x: 70,
        y: 78,
        title: "A calendar written by a river",
        body: "The Nile flooded at almost the same time each year. Egyptians split the year into three seasons around it — flood, planting and harvest — and built one of the first 365-day calendars.",
      },
      {
        id: "eg-3",
        label: "The sun overhead",
        x: 76,
        y: 20,
        title: "Writing that lasted 3,000 years",
        body: "Hieroglyphs mixed pictures and sounds. Scribes trained for years, and the skill was so valued that a scribe paid no tax and did no heavy labour.",
      },
    ],
  },
  {
    id: "renaissance",
    title: "Renaissance Italy",
    year: "1500 CE",
    summary:
      "Wealthy cities compete to hire the best painters, architects and engineers. Old Greek and Roman books are read again.",
    narrative:
      "Warm light falls across the workshop rooftops. Somewhere below, a dome nobody thought possible is already finished.",
    nodeClass: "from-orange-200 to-rose-300",
    hotspots: [
      {
        id: "re-1",
        label: "The cathedral dome",
        x: 50,
        y: 44,
        title: "A dome built without a frame",
        body: "Brunelleschi raised Florence's dome using a herringbone brick pattern that held itself up as it went, so no wooden scaffold was needed underneath. Nobody had done it at that size before.",
      },
      {
        id: "re-2",
        label: "An artist's workshop",
        x: 20,
        y: 70,
        title: "Painters were tradespeople",
        body: "Artists ran busy workshops with apprentices who ground pigments and prepared panels. A painting was a commission with a contract, not a lonely act of genius.",
      },
      {
        id: "re-3",
        label: "The printing shop",
        x: 78,
        y: 66,
        title: "Ideas get cheap",
        body: "By 1500 presses across Europe had printed millions of books. A text could now outrun the people trying to suppress it — which changed science, religion and politics together.",
      },
    ],
  },
  {
    id: "industrial",
    title: "The Industrial Revolution",
    year: "1850 CE",
    summary:
      "Coal, steam and iron reshape how people work and where they live. Cities grow faster than anyone can plan for.",
    narrative:
      "Smoke sits low over the rooftops. The machines do not stop when the sun goes down — and neither do the shifts.",
    nodeClass: "from-slate-400 to-slate-600",
    hotspots: [
      {
        id: "in-1",
        label: "Factory chimneys",
        x: 24,
        y: 34,
        title: "Air you could taste",
        body: "Coal smoke turned buildings black and filled the air with soot. British cities recorded 'pea-soup' fogs so thick that traffic stopped at midday.",
      },
      {
        id: "in-2",
        label: "The great gears",
        x: 58,
        y: 58,
        title: "One engine, a whole mill",
        body: "A single steam engine drove overhead shafts and leather belts that powered every machine in the building. If the engine stopped, the entire mill stopped.",
      },
      {
        id: "in-3",
        label: "The gaslight",
        x: 82,
        y: 46,
        title: "Childhood on a timetable",
        body: "Children as young as eight worked twelve-hour shifts. Campaigns through the 1800s slowly forced limits on hours and set the idea that school, not work, is where a child belongs.",
      },
    ],
  },
  {
    id: "space",
    title: "Future Space Age",
    year: "2100 CE",
    summary:
      "An imagined century ahead: permanent bases beyond Earth, and the hard engineering problems that would come with them.",
    narrative:
      "Earth is a bright disc behind you. Everything here — air, water, warmth — is something somebody had to bring or build.",
    nodeClass: "from-indigo-300 to-violet-400",
    hotspots: [
      {
        id: "sp-1",
        label: "The orbital station",
        x: 68,
        y: 32,
        title: "Spinning to make gravity",
        body: "A station that rotates pushes everything inside outwards, which feels like gravity. Build it too small and your head and feet spin at different speeds — which is why designs are so large.",
      },
      {
        id: "sp-2",
        label: "The greenhouse module",
        x: 28,
        y: 56,
        title: "Growing food off Earth",
        body: "Crops have already been grown on the International Space Station. The hard part is not the plants — it is closing the loop so water, air and waste keep cycling without resupply.",
      },
      {
        id: "sp-3",
        label: "The distant planet",
        x: 50,
        y: 76,
        title: "Why distance is the problem",
        body: "A radio message to Mars takes between 3 and 22 minutes each way. No one on Earth can talk a crew through an emergency in real time, so crews must be able to decide alone.",
      },
    ],
  },
];

/* ----------------------------------------------------------------------------
   Deterministic pseudo-randomness.

   Math.random() during render would produce different particle positions on the
   server and in the browser, which React reports as a hydration mismatch. This
   returns the same value for the same index every time, on both.
---------------------------------------------------------------------------- */
function seeded(index: number): number {
  let t = index + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function ParticleField({
  count,
  className,
  animation,
  minDuration,
  maxDuration,
}: {
  count: number;
  className: string;
  animation: string;
  minDuration: number;
  maxDuration: number;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const left = seeded(i * 3) * 100;
        const top = seeded(i * 3 + 1) * 100;
        const delay = seeded(i * 3 + 2) * 8;
        const duration = minDuration + seeded(i * 5) * (maxDuration - minDuration);
        const scale = 0.5 + seeded(i * 7) * 1.1;
        return (
          <span
            key={i}
            className={"absolute rounded-full " + className}
            style={{
              left: left + "%",
              top: top + "%",
              animation: `${animation} ${duration}s linear ${delay}s infinite`,
              transform: `scale(${scale})`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================================
   Scenes — every one is gradients, clip-paths and rounded boxes.
============================================================================ */

function EgyptScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-gradient-to-b from-sky-300 via-amber-200 to-amber-400"
    >
      {/* Day/night cycle: a full-height arm rotates, carrying the sun on its end,
          which traces a circle without any path maths. */}
      <div className="tt-orbit-arm absolute left-1/2 top-[85%] h-[150%] w-px -translate-x-1/2">
        <div className="absolute -left-8 -top-8 h-16 w-16 rounded-full bg-yellow-100 shadow-[0_0_60px_25px_rgba(254,240,138,0.75)]" />
      </div>
      <div className="tt-sky-night absolute inset-0 bg-gradient-to-b from-indigo-950 via-indigo-900 to-amber-950" />

      {/* Pyramids */}
      <div className="absolute bottom-[22%] left-[8%] h-[38%] w-[34%] bg-gradient-to-b from-amber-200 to-amber-500 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
      <div className="absolute bottom-[22%] left-[30%] h-[26%] w-[24%] bg-gradient-to-b from-amber-300 to-amber-600 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
      <div className="absolute bottom-[22%] left-[46%] h-[17%] w-[16%] bg-gradient-to-b from-amber-300 to-amber-600 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />

      {/* Palms on the far bank */}
      <div className="absolute bottom-[24%] right-[16%] h-[14%] w-1.5 rounded bg-amber-900/70" />
      <div className="absolute bottom-[36%] right-[14%] h-6 w-16 -translate-x-1/2 rounded-full bg-emerald-700/60 blur-[1px]" />

      {/* Desert floor, then the Nile */}
      <div className="absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-b from-amber-400 to-amber-600" />
      <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-b from-sky-600/80 to-sky-800/90" />
      <div className="tt-shimmer absolute inset-x-0 bottom-[4%] h-[3%] bg-white/25 blur-sm" />

      <ParticleField
        count={26}
        className="h-1 w-1 bg-amber-100/70"
        animation="tt-drift"
        minDuration={9}
        maxDuration={18}
      />
    </div>
  );
}

function RenaissanceScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-gradient-to-b from-orange-200 via-rose-200 to-amber-300"
    >
      <div className="absolute right-[12%] top-[10%] h-24 w-24 rounded-full bg-amber-100/90 blur-[2px] shadow-[0_0_70px_30px_rgba(254,243,199,0.6)]" />

      {/* Hills behind the city */}
      <div className="absolute bottom-[30%] left-0 h-[16%] w-full rounded-t-[100%] bg-emerald-800/25" />

      {/* The cathedral: drum, dome, lantern */}
      <div className="absolute bottom-[30%] left-1/2 h-[22%] w-[16%] -translate-x-1/2 bg-gradient-to-b from-stone-100 to-stone-300" />
      <div className="absolute bottom-[52%] left-1/2 h-[16%] w-[18%] -translate-x-1/2 rounded-t-full bg-gradient-to-b from-orange-400 to-orange-700" />
      <div className="absolute bottom-[68%] left-1/2 h-[4%] w-[3%] -translate-x-1/2 rounded-t bg-stone-100" />

      {/* The bell tower */}
      <div className="absolute bottom-[30%] left-[30%] h-[30%] w-[6%] bg-gradient-to-b from-stone-100 to-stone-300" />
      <div className="absolute bottom-[60%] left-[30%] h-[4%] w-[6%] bg-orange-700" />

      {/* Rooftops */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-orange-700 to-amber-900" />
      <div className="absolute bottom-[26%] left-[6%] h-[10%] w-[18%] bg-orange-800/80" />
      <div className="absolute bottom-[24%] right-[8%] h-[12%] w-[22%] bg-orange-800/70" />

      {/* Dust in the light */}
      <ParticleField
        count={22}
        className="h-1 w-1 bg-amber-50/80"
        animation="tt-float"
        minDuration={11}
        maxDuration={20}
      />
    </div>
  );
}

function IndustrialScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-800 via-slate-700 to-stone-800"
    >
      {/* Chimneys and their smoke */}
      {[14, 26, 38].map((left, i) => (
        <div key={left}>
          <div
            className="absolute bottom-[26%] w-[4%] bg-gradient-to-b from-stone-700 to-stone-900"
            style={{ left: left + "%", height: 34 + i * 8 + "%" }}
          />
          <div
            className="tt-smoke absolute h-16 w-16 rounded-full bg-slate-400/25 blur-xl"
            style={{
              left: left + 0.5 + "%",
              bottom: 26 + 34 + i * 8 + "%",
              animationDelay: i * 1.7 + "s",
            }}
          />
        </div>
      ))}

      {/* Gears */}
      <div className="tt-spin absolute bottom-[34%] left-[54%] h-28 w-28 rounded-full border-8 border-dashed border-amber-700/70" />
      <div className="tt-spin-reverse absolute bottom-[28%] left-[66%] h-20 w-20 rounded-full border-8 border-dashed border-amber-800/70" />

      {/* Gaslight */}
      <div className="absolute bottom-[26%] right-[16%] h-[22%] w-1 bg-stone-900" />
      <div className="tt-flicker absolute bottom-[46%] right-[15%] h-6 w-6 rounded-full bg-amber-200 shadow-[0_0_30px_12px_rgba(253,230,138,0.55)]" />

      {/* Cobbled ground */}
      <div className="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-b from-stone-800 to-stone-950" />
      {/* Low smog */}
      <div className="absolute inset-x-0 bottom-[20%] h-[20%] bg-gradient-to-t from-slate-500/40 to-transparent blur-md" />

      <ParticleField
        count={30}
        className="h-1 w-1 bg-slate-300/40"
        animation="tt-drift"
        minDuration={7}
        maxDuration={15}
      />
    </div>
  );
}

function SpaceScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950"
    >
      {/* Stars */}
      {Array.from({ length: 60 }, (_, i) => (
        <span
          key={i}
          className="tt-twinkle absolute rounded-full bg-white"
          style={{
            left: seeded(i * 11) * 100 + "%",
            top: seeded(i * 11 + 1) * 100 + "%",
            height: 1 + Math.round(seeded(i * 11 + 2) * 2) + "px",
            width: 1 + Math.round(seeded(i * 11 + 2) * 2) + "px",
            animationDelay: seeded(i * 13) * 4 + "s",
          }}
        />
      ))}

      {/* The planet below */}
      <div className="absolute -bottom-[38%] left-1/2 h-[70%] w-[130%] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-sky-500 via-indigo-700 to-slate-950 shadow-[0_-30px_90px_-10px_rgba(56,189,248,0.5)]" />
      <div className="absolute -bottom-[36%] left-1/2 h-[68%] w-[128%] -translate-x-1/2 rounded-[50%] bg-emerald-600/20" />

      {/* Rotating station */}
      <div className="tt-orbit-slow absolute right-[22%] top-[24%] h-24 w-24">
        <div className="absolute inset-0 rounded-full border-[6px] border-slate-300/80" />
        <div className="absolute left-1/2 top-1/2 h-2 w-20 -translate-x-1/2 -translate-y-1/2 rounded bg-slate-300/80" />
        <div className="absolute left-1/2 top-1/2 h-20 w-2 -translate-x-1/2 -translate-y-1/2 rounded bg-slate-300/80" />
      </div>

      {/* Greenhouse module */}
      <div className="absolute bottom-[38%] left-[24%] h-10 w-24 rounded-full bg-emerald-400/40 shadow-[0_0_40px_10px_rgba(52,211,153,0.35)]" />

      <ParticleField
        count={18}
        className="h-0.5 w-0.5 bg-sky-200/70"
        animation="tt-float"
        minDuration={12}
        maxDuration={22}
      />
    </div>
  );
}

function SceneArt({ eraId }: { eraId: string }) {
  if (eraId === "egypt") return <EgyptScene />;
  if (eraId === "renaissance") return <RenaissanceScene />;
  if (eraId === "industrial") return <IndustrialScene />;
  return <SpaceScene />;
}

/* ============================================================================
   Component
============================================================================ */

export default function TimeTravelTimeline({
  showIntro = true,
}: {
  showIntro?: boolean;
} = {}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [openHotspot, setOpenHotspot] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimer = useRef<number | null>(null);
  const closedRef = useRef(false);

  const era = activeIndex === null ? null : ERAS[activeIndex];

  /* --- opening and closing the immersive view --------------------------- */

  const enter = useCallback((index: number) => {
    returnFocusRef.current = cardRefs.current[index] ?? null;
    setOpenHotspot(null);
    setActiveIndex(index);
  }, []);

  // showModal() has to run after the <dialog> is in the DOM, so it happens here
  // rather than inside the click handler.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeIndex !== null && !dialog.open) {
      dialog.showModal();
      // The dialog is fixed to the viewport; without this the page behind it
      // still scrolls under the scene on a trackpad or phone.
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  const finishClose = useCallback(() => {
    // Idempotent: whichever of the animation or the fallback timer arrives
    // first closes the dialog, and the other becomes a no-op.
    if (closedRef.current) return;
    closedRef.current = true;
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    dialogRef.current?.close();
    setClosing(false);
    setActiveIndex(null);
    setOpenHotspot(null);
    document.body.style.overflow = "";
    // Send focus back where it came from, or a keyboard user is dumped at the
    // top of the document with no idea where they were.
    returnFocusRef.current?.focus();
  }, []);

  // Plays the exit animation, then closes when it ends.
  const requestClose = useCallback(() => {
    closedRef.current = false;
    setClosing(true);
    /*
      The animation's `animationend` is the normal trigger. It does NOT fire
      under prefers-reduced-motion (the animation is set to `none`), and it does
      not fire in a background tab. Without this fallback the close button and
      Escape would both do nothing and the student would be shut inside the
      scene with no way out — so the timer, not the animation, is what actually
      guarantees the dialog closes.
    */
    closeTimer.current = window.setTimeout(finishClose, 420);
  }, [finishClose]);

  // Never leave a timer running against an unmounted component.
  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current === null ? 0 : (current + 1) % ERAS.length));
    setOpenHotspot(null);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <style>{`
        @keyframes tt-drift {
          0%   { transform: translate3d(0,0,0); opacity: 0; }
          10%  { opacity: .9; }
          100% { transform: translate3d(60px,-120px,0); opacity: 0; }
        }
        @keyframes tt-float {
          0%   { transform: translate3d(0,0,0); opacity: 0; }
          15%  { opacity: .85; }
          100% { transform: translate3d(-30px,-90px,0); opacity: 0; }
        }
        @keyframes tt-smoke {
          0%   { transform: translate3d(0,0,0) scale(.6); opacity: .5; }
          100% { transform: translate3d(40px,-220px,0) scale(2.4); opacity: 0; }
        }
        @keyframes tt-spin { to { transform: rotate(360deg); } }
        @keyframes tt-spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes tt-flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: .65; }
          55% { opacity: .95; }
          70% { opacity: .5; }
        }
        @keyframes tt-twinkle {
          0%, 100% { opacity: .25; }
          50% { opacity: 1; }
        }
        @keyframes tt-orbit-arm { to { transform: translateX(-50%) rotate(360deg); } }
        @keyframes tt-night {
          0%, 42%  { opacity: 0; }
          58%, 92% { opacity: .92; }
          100%     { opacity: 0; }
        }
        @keyframes tt-shimmer {
          0%, 100% { opacity: .2; transform: translateX(-4%); }
          50%      { opacity: .5; transform: translateX(4%); }
        }
        @keyframes tt-scene-in {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes tt-scene-out {
          from { opacity: 1; transform: none; }
          to   { opacity: 0; transform: scale(.97); }
        }
        @keyframes tt-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }

        .tt-orbit-arm      { transform-origin: 50% 0; animation: tt-orbit-arm 48s linear infinite; }
        .tt-sky-night      { animation: tt-night 48s linear infinite; opacity: 0; }
        .tt-shimmer        { animation: tt-shimmer 7s ease-in-out infinite; }
        .tt-smoke          { animation: tt-smoke 9s ease-out infinite; }
        .tt-spin           { animation: tt-spin 14s linear infinite; }
        .tt-spin-reverse   { animation: tt-spin-reverse 10s linear infinite; }
        .tt-flicker        { animation: tt-flicker 3.5s ease-in-out infinite; }
        .tt-twinkle        { animation: tt-twinkle 4s ease-in-out infinite; }
        .tt-orbit-slow     { animation: tt-spin 40s linear infinite; }
        /*
          No fill mode on the entrance animations. With animation-fill-mode
          set to both, the element holds the keyframe start state (opacity 0)
          until the animation actually
          runs — so anywhere animations are suspended, the scene renders
          invisible and the page shows through it. Without a fill mode the
          natural state is fully visible and the animation is pure decoration.
        */
        .tt-scene-in       { animation: tt-scene-in .5s cubic-bezier(.22,.61,.36,1); }
        .tt-scene-out      { animation: tt-scene-out .28s ease-in both; }
        .tt-rise           { animation: tt-rise .45s cubic-bezier(.22,.61,.36,1); }

        /*
          A full-screen scene with drifting particles and a spinning sky is
          exactly the kind of thing that triggers vestibular symptoms, so every
          ambient animation stops here — the scene still renders in full, it
          simply holds still.
        */
        @media (prefers-reduced-motion: reduce) {
          .tt-orbit-arm, .tt-sky-night, .tt-shimmer, .tt-smoke, .tt-spin,
          .tt-spin-reverse, .tt-flicker, .tt-twinkle, .tt-orbit-slow,
          .tt-scene-in, .tt-scene-out, .tt-rise {
            animation: none !important;
          }
          .tt-sky-night { opacity: 0; }
        }

        dialog.tt-dialog::backdrop { background: rgba(10, 8, 12, .72); }
        dialog.tt-dialog { max-width: 100vw; max-height: 100vh; }
      `}</style>

      {showIntro ? (
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson-600">
            Step inside
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-800 sm:text-3xl">
            Time Travel Timeline
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-600">
            Choose a period and step into it. Each scene is built from shapes and colour rather
            than photographs, so treat it as an artist&apos;s impression — the facts on the
            markers are the real part.
          </p>
        </header>
      ) : null}

      {/* ---------------- Timeline ---------------- */}
      <ol className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* The connecting rail, drawn only where the row is actually a row. */}
        <li
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[38px] hidden h-0.5 bg-gradient-to-r from-mist-200 via-gold-500/60 to-mist-200 xl:block"
        />

        {ERAS.map((item, index) => (
          <li key={item.id} className="relative">
            <button
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              type="button"
              onClick={() => enter(index)}
              className="group flex h-full w-full flex-col rounded-lg border border-mist-200 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-gold-500/60 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-600"
            >
              <span
                aria-hidden
                className={
                  "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ring-4 ring-white transition-transform duration-200 group-hover:scale-110 " +
                  item.nodeClass
                }
              >
                <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.14em] text-crimson-600">
                {item.year}
              </span>
              <span className="mt-1 font-display text-lg font-semibold text-maroon-800">
                {item.title}
              </span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                {item.summary}
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson-600">
                Step inside
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* ---------------- Immersive view ---------------- */}
      <dialog
        ref={dialogRef}
        className="tt-dialog h-full max-h-full w-full max-w-full overflow-hidden border-0 bg-transparent p-0"
        aria-labelledby="tt-scene-title"
        onCancel={(event) => {
          // Escape: intercept so the exit animation gets to play, then close.
          event.preventDefault();
          requestClose();
        }}
        onClose={() => {
          setActiveIndex(null);
          setClosing(false);
          document.body.style.overflow = "";
        }}
      >
        {era ? (
          <div
            key={era.id + (closing ? "-out" : "-in")}
            className={
              "relative h-screen w-screen overflow-hidden " +
              (closing ? "tt-scene-out" : "tt-scene-in")
            }
            onAnimationEnd={(event) => {
              // Children animate too (the narrative line, the fact panel) and
              // their events bubble to here — only the scene's own exit counts.
              if (closing && event.target === event.currentTarget) finishClose();
            }}
          >
            <SceneArt eraId={era.id} />

            {/* Readability wash, so white text survives a bright desert sky. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70"
            />

            {/* Top bar */}
            <div className="absolute inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
              <div className="tt-rise">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                  {era.year}
                </p>
                <h3
                  id="tt-scene-title"
                  className="font-display text-2xl font-semibold text-white drop-shadow-lg sm:text-3xl"
                >
                  {era.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={goToNext}
                  className="rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Next era →
                </button>
                <button
                  type="button"
                  onClick={requestClose}
                  className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-maroon-800 transition-colors hover:bg-mist-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  ✕ Return to timeline
                </button>
              </div>
            </div>

            {/* Narrative line */}
            <p className="tt-rise absolute inset-x-0 top-28 z-10 mx-auto max-w-xl px-6 text-center text-sm leading-relaxed text-white/90 drop-shadow sm:top-32 sm:text-base">
              {era.narrative}
            </p>

            {/* Hotspots */}
            {era.hotspots.map((spot) => {
              const open = openHotspot === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  aria-expanded={open}
                  aria-controls="tt-hotspot-panel"
                  onClick={() => setOpenHotspot(open ? null : spot.id)}
                  style={{ left: spot.x + "%", top: spot.y + "%" }}
                  className={
                    "absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 backdrop-blur-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " +
                    (open
                      ? "h-9 w-9 bg-white ring-white scale-110"
                      : "h-8 w-8 bg-white/35 ring-white/80 hover:scale-125 hover:bg-white/60")
                  }
                >
                  <span className="sr-only">{spot.label}</span>
                  <span
                    aria-hidden
                    className={
                      "block text-base font-bold " + (open ? "text-maroon-800" : "text-white")
                    }
                  >
                    {open ? "−" : "+"}
                  </span>
                </button>
              );
            })}

            {/* Fact panel */}
            <div
              id="tt-hotspot-panel"
              aria-live="polite"
              className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6"
            >
              {openHotspot ? (
                (() => {
                  const spot = era.hotspots.find((h) => h.id === openHotspot);
                  if (!spot) return null;
                  return (
                    <div className="tt-rise mx-auto max-w-2xl rounded-xl bg-white/95 p-5 shadow-2xl ring-1 ring-black/10 backdrop-blur">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-display text-base font-semibold text-maroon-800">
                          {spot.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setOpenHotspot(null)}
                          className="shrink-0 rounded px-2 text-lg leading-none text-ink-500 transition-colors hover:text-crimson-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-600"
                        >
                          <span aria-hidden>×</span>
                          <span className="sr-only">Close this fact</span>
                        </button>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">{spot.body}</p>
                    </div>
                  );
                })()
              ) : (
                <p className="mx-auto max-w-2xl text-center text-xs text-white/75">
                  Select a <span aria-hidden>+</span>
                  <span className="sr-only">plus</span> marker to read about life in this
                  period. Press Escape to return to the timeline.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </dialog>

      <p className="mt-8 rounded-lg bg-mist-100 px-5 py-4 text-xs leading-relaxed text-ink-600">
        <strong className="font-bold text-ink-900">About these scenes:</strong> the artwork is an
        impression built from coloured shapes, not a reconstruction — real Egyptian pyramids were
        cased in smooth white limestone, and no photograph exists of 2100. The facts attached to
        each marker are accurate; the pictures are there to help you imagine, and are worth
        comparing against real photographs and drawings.
      </p>
    </div>
  );
}
