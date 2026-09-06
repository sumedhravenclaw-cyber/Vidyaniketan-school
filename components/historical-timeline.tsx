"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

/* ============================================================================
   Cross-cultural historical timeline.

   The teaching point is the *column comparison*: whatever era a student picks,
   all four regions are shown side by side, so "nothing was happening there" is
   visibly untrue. Dates are approximate and the eras overlap at the edges —
   history does not divide neatly, and the footnote says so.
============================================================================ */

type Category = "science" | "art" | "politics";

type HistoryEvent = {
  category: Category;
  title: string;
  detail: string;
};

type RegionId = "asia" | "europe" | "americas" | "africa";

type Era = {
  id: string;
  label: string;
  span: string;
  entries: Record<RegionId, HistoryEvent[]>;
};

const CATEGORIES: Record<Category, { icon: string; label: string; className: string }> = {
  /*
    Each badge carries an icon and a word as well as a colour. Colour alone
    fails for a colour-blind student (and WCAG 1.4.1), and these three sit on a
    mostly-warm brand palette where red and gold are easy to confuse.
  */
  science: {
    icon: "🔬",
    label: "Science & Tech",
    className: "bg-sky-50 text-sky-900 ring-sky-200",
  },
  art: {
    icon: "🎨",
    label: "Art & Culture",
    className: "bg-gold-400/20 text-gold-600 ring-gold-500/40",
  },
  politics: {
    icon: "🏛️",
    label: "Politics & Empires",
    className: "bg-crimson-50 text-crimson-700 ring-crimson-100",
  },
};

const REGIONS: { id: RegionId; name: string; icon: string }[] = [
  { id: "asia", name: "Asia & the Middle East", icon: "🌏" },
  { id: "europe", name: "Europe", icon: "🌍" },
  { id: "americas", name: "The Americas", icon: "🌎" },
  { id: "africa", name: "Africa", icon: "🌍" },
];

const ERAS: Era[] = [
  {
    id: "500bce",
    label: "500 BCE",
    span: "around 2,500 years ago",
    entries: {
      asia: [
        {
          category: "politics",
          title: "The Persian Royal Road",
          detail:
            "Darius I built a paved highway roughly 2,700 km long. Relay riders carried a message end to end in about a week — a journey that took walkers three months.",
        },
        {
          category: "art",
          title: "Confucius teaches in China",
          detail:
            "Confucius (551–479 BCE) taught that good rulers earn respect rather than demand it. His ideas shaped schools and governments across East Asia for the next 2,000 years.",
        },
        {
          category: "science",
          title: "Pāṇini's grammar of Sanskrit",
          detail:
            "In ancient India, Pāṇini described the whole Sanskrit language in about 4,000 short rules. Computer scientists still study it as one of the first formal rule systems ever written.",
        },
      ],
      europe: [
        {
          category: "politics",
          title: "Athens tries democracy",
          detail:
            "Athenian citizens voted directly on laws instead of obeying a king. Only free adult men counted as citizens, so most people — women, enslaved people, foreigners — had no vote.",
        },
        {
          category: "science",
          title: "Greeks start proving things",
          detail:
            "Other peoples had used geometry for centuries. Greek mathematicians added something new: proving *why* a rule must always be true, not just that it works.",
        },
        {
          category: "politics",
          title: "Rome becomes a republic",
          detail:
            "Traditionally dated to 509 BCE, Rome replaced its kings with elected officials — a small city-state that would later rule the Mediterranean.",
        },
      ],
      americas: [
        {
          category: "art",
          title: "The Olmec colossal heads",
          detail:
            "Olmec sculptors in Mexico carved heads up to 3 m tall from basalt boulders, then moved them many kilometres without wheels or draft animals.",
        },
        {
          category: "science",
          title: "Early writing at Monte Albán",
          detail:
            "Zapotec people in Oaxaca founded the hilltop city of Monte Albán and carved one of the earliest writing systems in the Americas.",
        },
        {
          category: "science",
          title: "Andean engineering at Chavín",
          detail:
            "Builders at Chavín de Huántar in Peru cut stone galleries and drainage canals into a temple complex — channels that still move water when it rains.",
        },
      ],
      africa: [
        {
          category: "science",
          title: "Nok iron smelting",
          detail:
            "The Nok culture of central Nigeria worked iron and modelled striking terracotta figures — among the earliest ironworking in West Africa.",
        },
        {
          category: "politics",
          title: "The Kingdom of Kush",
          detail:
            "Kushite kings had ruled Egypt itself in the century before. From Meroë, on the Nile in present-day Sudan, they built pyramids and a major ironworking centre.",
        },
        {
          category: "politics",
          title: "Carthage trades the Mediterranean",
          detail:
            "Founded by Phoenician settlers on the North African coast, Carthage grew into one of the richest trading cities in the ancient world.",
        },
      ],
    },
  },
  {
    id: "1000ce",
    label: "1000 CE",
    span: "around 1,000 years ago",
    entries: {
      asia: [
        {
          category: "science",
          title: "Ibn al-Haytham tests light",
          detail:
            "Working in Cairo, Ibn al-Haytham (c. 965–1040) argued you should trust experiments over famous authors. His work on how light and vision behave is an early version of the scientific method.",
        },
        {
          category: "science",
          title: "Song China prints and navigates",
          detail:
            "Bi Sheng made movable type from baked clay around 1040 — four centuries before Gutenberg. Chinese sailors were also the first to steer by magnetic compass.",
        },
        {
          category: "science",
          title: "Zero travels west",
          detail:
            "The place-value number system with a symbol for zero, developed in India, spread through Baghdad's scholars into the rest of the world. You used it to write today's date.",
        },
      ],
      europe: [
        {
          category: "science",
          title: "Better ploughs, bigger harvests",
          detail:
            "Heavy ploughs, horse collars and three-field rotation let farmers work harder soils. England's Domesday survey of 1086 counted around 6,000 water mills.",
        },
        {
          category: "art",
          title: "Books survive in monasteries",
          detail:
            "Every book was copied out by hand. Monastery libraries were where most older writing survived — one reason so much was lost when a library burned.",
        },
        {
          category: "politics",
          title: "A patchwork of small kingdoms",
          detail:
            "There was no single European power. Land was held through chains of loyalty between lords and those who farmed for them.",
        },
      ],
      americas: [
        {
          category: "politics",
          title: "Cahokia, a city on the Mississippi",
          detail:
            "Near modern St. Louis, Cahokia held perhaps 10,000–20,000 people at its height — larger than London at the time. Monks Mound is still the biggest earthwork in the Americas.",
        },
        {
          category: "science",
          title: "Maya astronomers watch Venus",
          detail:
            "Maya skywatchers tracked Venus so carefully they could predict where it would appear years ahead, and aligned buildings at Chichén Itzá to the sun's path.",
        },
        {
          category: "science",
          title: "Farming a freezing plateau",
          detail:
            "Around Lake Titicaca, farmers built raised fields whose water channels stored daytime heat and protected crops from night frost. They also freeze-dried potatoes to store for years.",
        },
      ],
      africa: [
        {
          category: "politics",
          title: "The Ghana Empire's gold",
          detail:
            "Ghana sat between the Saharan salt mines and the southern goldfields, taxing both. Salt was so valuable it was sometimes traded weight for weight against gold.",
        },
        {
          category: "art",
          title: "Aksum's stone obelisks",
          detail:
            "The Ethiopian kingdom of Aksum raised carved granite stelae up to 24 m tall and minted its own coins — something few states anywhere did at the time.",
        },
        {
          category: "science",
          title: "Sailing by the monsoon",
          detail:
            "Swahili coast ports like Kilwa and Mombasa timed voyages to seasonal winds that blow one way for months, then reverse — carrying goods to Arabia, India and China.",
        },
      ],
    },
  },
  {
    id: "1500ce",
    label: "1500 CE",
    span: "around 500 years ago",
    entries: {
      asia: [
        {
          category: "politics",
          title: "The Ottoman Empire rises",
          detail:
            "After taking Constantinople in 1453, the Ottomans controlled the crossroads between Europe and Asia — one reason European sailors went looking for sea routes instead.",
        },
        {
          category: "science",
          title: "Zheng He's treasure fleets",
          detail:
            "Between 1405 and 1433 Chinese admiral Zheng He sailed as far as East Africa with hundreds of ships, decades before Columbus crossed the Atlantic in three.",
        },
        {
          category: "art",
          title: "Vijayanagara in southern India",
          detail:
            "The empire's capital at Hampi drew traders from across Asia. Visitors described a city of temples, markets and irrigation works serving hundreds of thousands of people.",
        },
      ],
      europe: [
        {
          category: "art",
          title: "The Renaissance",
          detail:
            "Artists and thinkers looked back to Greek and Roman work for inspiration. Leonardo da Vinci filled notebooks with anatomy, water, and flying machines that were centuries early.",
        },
        {
          category: "science",
          title: "The printing press",
          detail:
            "Gutenberg's press meant a book could be copied hundreds of times instead of once. Ideas — and arguments — began spreading faster than any authority could control.",
        },
        {
          category: "politics",
          title: "Ocean voyages and their cost",
          detail:
            "European ships reached the Americas in 1492 and India by sea in 1498. What followed was invasion, colonisation and the transatlantic trade in enslaved people.",
        },
      ],
      americas: [
        {
          category: "science",
          title: "Tenochtitlan's floating gardens",
          detail:
            "The Mexica (Aztec) capital was built on a lake and fed by chinampas — artificial islands of mud and reeds that grew several harvests a year. Perhaps 200,000 people lived there.",
        },
        {
          category: "science",
          title: "Inca roads and knotted records",
          detail:
            "About 40,000 km of road crossed the Andes, with woven rope bridges over gorges. Officials recorded numbers on quipu — knotted cords read by touch as well as sight.",
        },
        {
          category: "politics",
          title: "A catastrophe, not a discovery",
          detail:
            "Within a century of 1492, war and introduced diseases killed a large majority of the people living in the Americas. It is one of the worst population collapses in recorded history.",
        },
      ],
      africa: [
        {
          category: "art",
          title: "The scholars of Timbuktu",
          detail:
            "Timbuktu's mosques and schools drew students from across the Sahara. Families there still hold tens of thousands of handwritten manuscripts on law, astronomy and medicine.",
        },
        {
          category: "politics",
          title: "The Songhai Empire",
          detail:
            "Songhai grew into one of the largest empires in African history, controlling the Niger river trade and the cities of Gao, Djenné and Timbuktu.",
        },
        {
          category: "art",
          title: "Benin's brass casters",
          detail:
            "Artists in Benin City (modern Nigeria) cast detailed brass plaques using the lost-wax method — metalwork as fine as anything being made in Europe at the time.",
        },
      ],
    },
  },
  {
    id: "1750ce",
    label: "1750 CE",
    span: "around 275 years ago",
    entries: {
      asia: [
        {
          category: "politics",
          title: "Mughal India breaks apart",
          detail:
            "As Mughal power weakened, regional rulers rose — and the British East India Company, a trading business with its own army, won at Plassey in 1757 and began governing land.",
        },
        {
          category: "art",
          title: "Qing China, the largest economy",
          detail:
            "China produced more goods than any other country on earth, and Beijing was among the world's biggest cities.",
        },
        {
          category: "science",
          title: "Edo Japan reads",
          detail:
            "Largely closed to foreign trade, Japan built an unusually literate society with busy woodblock printing — cheap illustrated books and prints sold in city bookshops.",
        },
      ],
      europe: [
        {
          category: "science",
          title: "Steam changes everything",
          detail:
            "Engines first built to pump water out of mines were improved by James Watt into machines that could drive factories — the start of the Industrial Revolution.",
        },
        {
          category: "art",
          title: "The Enlightenment",
          detail:
            "Writers argued that reason and evidence should decide questions, not tradition. Diderot's Encyclopédie tried to gather all human knowledge into one printed set.",
        },
        {
          category: "politics",
          title: "Empires built on slavery",
          detail:
            "The 1700s were the peak decades of the transatlantic slave trade. European wealth in this era cannot be separated from the people it was taken from.",
        },
      ],
      americas: [
        {
          category: "politics",
          title: "Colonies and revolutions",
          detail:
            "Britain, Spain, Portugal and France ruled most of the Americas. The thirteen British colonies declared independence in 1776; Latin American republics followed decades later.",
        },
        {
          category: "politics",
          title: "The Haudenosaunee Confederacy",
          detail:
            "Six nations around the Great Lakes governed themselves under the Great Law of Peace, a constitution older than any European one in the Americas.",
        },
        {
          category: "science",
          title: "Silver that moved the world",
          detail:
            "Silver mined under brutal conditions at Potosí in Bolivia flowed to Europe and on to China, becoming a currency that linked economies across four continents.",
        },
      ],
      africa: [
        {
          category: "politics",
          title: "The Asante Empire",
          detail:
            "Founded around 1701 in present-day Ghana, Asante grew wealthy on gold and built a state whose symbol, the Golden Stool, still carries meaning today.",
        },
        {
          category: "politics",
          title: "The cost of the slave trade",
          detail:
            "Millions of people were captured and shipped across the Atlantic in this century. Whole regions lost the young adults their communities depended on.",
        },
        {
          category: "art",
          title: "The castles of Gondar",
          detail:
            "Ethiopian emperors built a walled complex of stone castles and churches at Gondar, blending local, Arab and Indian design.",
        },
      ],
    },
  },
  {
    id: "1900ce",
    label: "1900 CE",
    span: "around 125 years ago",
    entries: {
      asia: [
        {
          category: "politics",
          title: "India under British rule",
          detail:
            "Most of Asia was governed by European powers. The Indian National Congress, founded in 1885, was beginning the long campaign that ended in independence in 1947.",
        },
        {
          category: "science",
          title: "Japan industrialises fast",
          detail:
            "After 1868 Japan built railways, factories and schools at extraordinary speed, becoming an industrial power within a single lifetime.",
        },
        {
          category: "art",
          title: "Arguments about change",
          detail:
            "Across the Ottoman lands, Persia, China and India, reformers argued over how much to borrow from Europe and how much to keep — debates that shaped the next century.",
        },
      ],
      europe: [
        {
          category: "science",
          title: "Electricity, X-rays and radioactivity",
          detail:
            "Röntgen found X-rays in 1895; Marie Curie's work on radioactivity won her Nobel Prizes in two different sciences — still the only person to manage it.",
        },
        {
          category: "politics",
          title: "The scramble for empire",
          detail:
            "At a conference in Berlin in 1884–85, European powers divided Africa between themselves on a map, with no African representatives present.",
        },
        {
          category: "art",
          title: "Cities and schools grow",
          detail:
            "Factory towns swelled and governments began providing schooling for ordinary children, so reading stopped being a privilege of the rich.",
        },
      ],
      americas: [
        {
          category: "science",
          title: "Light bulbs and flight",
          detail:
            "Electric light was spreading through American cities, and in 1903 the Wright brothers kept a powered aircraft in the air for twelve seconds.",
        },
        {
          category: "politics",
          title: "Independent republics",
          detail:
            "Almost all of the Americas was self-governing by now, though wealth and power stayed concentrated in a few hands.",
        },
        {
          category: "politics",
          title: "Land taken from Native nations",
          detail:
            "Treaties were broken, communities were forced onto reservations, and children were sent to boarding schools designed to erase their languages.",
        },
      ],
      africa: [
        {
          category: "politics",
          title: "A continent colonised",
          detail:
            "Within about 25 years, nearly all of Africa came under European control — the fastest land grab in modern history.",
        },
        {
          category: "politics",
          title: "Ethiopia holds out",
          detail:
            "At Adwa in 1896 an Ethiopian army defeated an invading Italian force, keeping the country independent and becoming a symbol of resistance worldwide.",
        },
        {
          category: "science",
          title: "Railways built to extract",
          detail:
            "New railway lines ran from mines and plantations to ports, not between African cities — infrastructure designed to move resources out.",
        },
      ],
    },
  },
  {
    id: "modern",
    label: "Modern Era",
    span: "1950 to today",
    entries: {
      asia: [
        {
          category: "politics",
          title: "Independence",
          detail:
            "India and Pakistan became independent in 1947, and dozens of Asian nations followed. Redrawing borders also caused some of the largest forced migrations in history.",
        },
        {
          category: "science",
          title: "Chandrayaan-3 reaches the Moon",
          detail:
            "In August 2023 India landed a craft near the Moon's south pole — the first country to do so — on a mission that cost less than many feature films.",
        },
        {
          category: "science",
          title: "The world's electronics workshop",
          detail:
            "Most of the phones, chips and screens in daily use are designed and built across East and South Asia.",
        },
      ],
      europe: [
        {
          category: "science",
          title: "The World Wide Web",
          detail:
            "Tim Berners-Lee wrote the first web browser and server at CERN in 1989, so physicists could share papers. He gave the design away for free.",
        },
        {
          category: "politics",
          title: "Cooperation after catastrophe",
          detail:
            "After two world wars, former enemies built shared institutions and open borders — an experiment in preventing war through trade and treaty.",
        },
        {
          category: "science",
          title: "Hunting the building blocks",
          detail:
            "CERN's Large Hadron Collider, a 27 km ring under the French–Swiss border, confirmed the Higgs boson in 2012.",
        },
      ],
      americas: [
        {
          category: "science",
          title: "Footprints on the Moon",
          detail:
            "Apollo 11 landed in 1969, guided by computers with less memory than a modern greeting card that plays music.",
        },
        {
          category: "politics",
          title: "Civil rights",
          detail:
            "Long campaigns overturned laws that segregated people by race, and changed what citizens elsewhere believed protest could achieve.",
        },
        {
          category: "art",
          title: "Music that travelled",
          detail:
            "Jazz, samba, reggae and hip-hop grew out of communities across the Americas and became some of the most widely heard music on earth.",
        },
      ],
      africa: [
        {
          category: "politics",
          title: "Independence and after",
          detail:
            "Ghana became independent in 1957 and most of the continent followed within a decade. Apartheid in South Africa ended with elections in 1994.",
        },
        {
          category: "science",
          title: "Banking by phone",
          detail:
            "Kenya's M-Pesa let people send money by text message from 2007, reaching millions who never had a bank account — and was copied worldwide.",
        },
        {
          category: "science",
          title: "Listening to the universe",
          detail:
            "South Africa's Karoo desert hosts part of the Square Kilometre Array, being built into the most sensitive radio telescope ever made.",
        },
      ],
    },
  },
];

/* ============================================================================
   Component
============================================================================ */

export default function HistoricalTimeline({
  showIntro = true,
}: {
  /**
   * Set false when the surrounding page already supplies a heading, so the
   * page does not show two titles for one section.
   */
  showIntro?: boolean;
} = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Framer's own hook, so the OS "reduce motion" setting silences every
  // transform below. Students who get motion sickness from sliding panels are
  // a real group, and this page is not optional reading for them.
  const reduceMotion = useReducedMotion();

  const era = ERAS[activeIndex];

  const select = useCallback((index: number, focus: boolean) => {
    const next = (index + ERAS.length) % ERAS.length;
    setActiveIndex(next);
    if (focus) tabRefs.current[next]?.focus();
  }, []);

  // Keeps the chosen era visible on a phone, where the rail scrolls sideways.
  // `block: "nearest"` so bringing a chip into view never jumps the whole page.
  useEffect(() => {
    tabRefs.current[activeIndex]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex, reduceMotion]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(activeIndex + 1, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(activeIndex - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(ERAS.length - 1, true);
    }
  }

  /* ------------------------------------------------------------------
     Motion definitions.

     Derived from `reduceMotion` rather than duplicated behind a media
     query, so there is exactly one place where "does this move?" is decided.
  ------------------------------------------------------------------ */

  const gridVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        hidden: { opacity: 0 },
        // The children carry the movement; the parent only sequences them.
        show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        // Exit leaves as one block. Staggering the way out as well would double
        // the wait before the new era appears, since mode="wait" already
        // serialises the two halves.
        exit: { opacity: 0, x: -40, transition: { duration: 0.2, ease: "easeIn" } },
      };

  const cardVariants: Variants = reduceMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        hidden: { opacity: 0, x: 40 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] },
        },
      };

  // Scoped inside `whileHover` rather than set as a component-level
  // `transition`, which would otherwise override the variant timings above.
  const cardHover = reduceMotion
    ? {}
    : {
        whileHover: {
          y: -6,
          boxShadow: "0 10px 25px -5px rgba(38, 38, 44, 0.18)",
          transition: { duration: 0.2, ease: "easeOut" as const },
        },
      };

  const chipMotion = reduceMotion
    ? {}
    : { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      {showIntro ? (
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson-600">
            World history
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-maroon-800 sm:text-3xl">
            Cross-Cultural Historical Timeline
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-600">
            Pick a moment in history and see all four regions at once. Textbooks often follow
            one region down the page; this reads across, so you can ask a better question &mdash;
            what was happening everywhere else while this was going on?
          </p>
        </header>
      ) : null}

      {/* ---------------- Era selector ---------------- */}
      {/*
        `py-2` is load-bearing: the chips scale to 1.05 on hover, and without
        vertical room inside this scroll container the growth gets clipped.
      */}
      <div
        role="tablist"
        aria-label="Choose a time period"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-2 sm:mx-0 sm:px-1"
      >
        {ERAS.map((item, index) => {
          const active = index === activeIndex;
          return (
            <motion.button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={"era-tab-" + item.id}
              aria-selected={active}
              aria-controls={"era-panel-" + item.id}
              tabIndex={active ? 0 : -1}
              onClick={() => select(index, false)}
              {...chipMotion}
              className={
                "relative shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-600 " +
                (active
                  ? "text-white"
                  : "bg-white text-maroon-800 ring-1 ring-mist-200 hover:bg-mist-100")
              }
            >
              {/*
                One pill shared across all six buttons via layoutId, so Framer
                slides it from the old chip to the new one instead of
                cross-fading two separate backgrounds.
              */}
              {active ? (
                <motion.span
                  layoutId="activeEraPill"
                  aria-hidden
                  className="absolute inset-0 rounded-lg bg-maroon-800"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* ---------------- Legend ---------------- */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Categories
        </span>
        {(Object.keys(CATEGORIES) as Category[]).map((key) => (
          <span
            key={key}
            className={
              "rounded-md px-2 py-1 text-xs font-semibold ring-1 " + CATEGORIES[key].className
            }
          >
            <span aria-hidden="true">{CATEGORIES[key].icon}</span> {CATEGORIES[key].label}
          </span>
        ))}
      </div>

      {/* ---------------- Regional columns ---------------- */}
      {/*
        `overflow-x-clip`, not `overflow-hidden`: the panels slide 40px along
        the x axis, which would otherwise widen the page and flash a horizontal
        scrollbar mid-transition. Clipping one axis leaves the other visible, so
        the cards' hover lift and shadow still escape the box -- plain `hidden`
        would force overflow-y to auto and crop them. The -mx-2/px-2 pair gives
        the shadow room without shifting the grid.
      */}
      <noscript>
        {/* Without JavaScript nothing ever animates these back into view. */}
        <style>{`[data-era-panel]{opacity:1!important;transform:none!important}
                 [data-region-card]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <div className="relative -mx-2 mt-6 overflow-x-clip px-2 py-2">
        {/*
          The first panel animates in as well, so the effect is visible on page
          load and not only after clicking an era.

          The cost is that Framer writes opacity:0 into the server-rendered
          HTML, which would leave a blank grid for anyone whose JavaScript
          never arrives. The <noscript> block above restores it for them -- it
          only takes effect when scripts are off, so it costs nothing
          otherwise.
        */}
        <AnimatePresence mode="wait">
          <motion.div
            key={era.id}
            role="tabpanel"
            id={"era-panel-" + era.id}
            aria-labelledby={"era-tab-" + era.id}
            tabIndex={0}
            data-era-panel=""
            variants={gridVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="focus:outline-none"
          >
            <p className="mb-5 text-sm text-ink-500">
              Showing <strong className="font-semibold text-ink-900">{era.label}</strong> &mdash;{" "}
              {era.span}.
            </p>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {REGIONS.map((region) => (
                <motion.section
                  key={region.id}
                  data-region-card=""
                  variants={cardVariants}
                  {...cardHover}
                  // A resting shadow so the hover value has something to
                  // interpolate from; animating out of "none" snaps instead.
                  style={{ boxShadow: "0 1px 2px rgba(38, 38, 44, 0.06)" }}
                  aria-labelledby={"region-" + era.id + "-" + region.id}
                  className="flex flex-col overflow-hidden rounded-lg border border-mist-200 bg-white"
                >
                  <span aria-hidden className="block h-1 bg-gold-500" />

                  <h3
                    id={"region-" + era.id + "-" + region.id}
                    className="border-b border-mist-100 px-5 py-4 font-display text-base font-semibold text-maroon-800"
                  >
                    <span aria-hidden="true" className="mr-2">
                      {region.icon}
                    </span>
                    {region.name}
                  </h3>

                  <ul className="flex flex-1 flex-col divide-y divide-mist-100">
                    {era.entries[region.id].map((item) => {
                      const meta = CATEGORIES[item.category];
                      return (
                        <li key={item.title} className="px-5 py-4">
                          <span
                            className={
                              "inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 " +
                              meta.className
                            }
                          >
                            <span aria-hidden="true">{meta.icon}</span>{" "}
                            <span className="sr-only">Category: </span>
                            {meta.label}
                          </span>
                          <h4 className="mt-2 text-sm font-bold text-ink-900">{item.title}</h4>
                          <p className="mt-1 text-sm leading-relaxed text-ink-600">
                            {item.detail}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </motion.section>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-8 rounded-lg bg-mist-100 px-5 py-4 text-xs leading-relaxed text-ink-600">
        <strong className="font-bold text-ink-900">About these dates:</strong> each era is a
        rough marker, not a hard boundary &mdash; empires and ideas overlap, and a date like
        &ldquo;500 BCE&rdquo; covers a century either side. The entries are starting points for
        discussion, not a complete history: every one of these regions holds far more than three
        cards can show, and a good next step is to check any of them in a library or a reliable
        encyclopedia.
      </p>
    </div>
  );
}
