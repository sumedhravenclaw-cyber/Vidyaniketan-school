"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import {
  Gauge,
  Landmark,
  Pause,
  Play,
  Rewind,
  ScrollText,
  SkipBack,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ZoomOut,
} from "lucide-react";

/* ============================================================================
   Living History Atlas

   HOW THE BORDERS MOVE
   Each territory is a radial polygon: a centre, sixteen fixed angles, and a
   per-era "reach" plus a directional bias. Interpolating reach and bias between
   one era and the next makes a territory genuinely grow, drift and shrink
   rather than snap between colours. A fixed per-region wobble keeps the outline
   irregular so nothing looks like a circle.

   WHAT THIS IS NOT
   These are schematic territories, not historical borders. Real border data for
   5,000 years exists (Euratlas, CShapes) but is far too large to embed, and a
   map that *looks* authoritative while being invented is worse than one that
   admits it. The caption under the map says so.

   PERFORMANCE
   The animation loop writes `d`, `fill` and `opacity` straight onto DOM nodes
   through refs. React renders the structure once and is never asked to
   reconcile at 60fps. Panel figures are a separate, throttled 10Hz state
   update, because nobody can read a number changing sixty times a second.
============================================================================ */

const START_YEAR = -3000;
const END_YEAR = 2025;
const POINTS = 16;
/** Years of history per real second at 1x. Crosses 5,000 years in ~50s. */
const YEARS_PER_SECOND = 100;

type Period = {
  from: number;
  to: number;
  name: string;
  color: string;
  /** Territory size multiplier — 1 is the region's resting extent. */
  reach: number;
  /** Directional drift of the territory's centre, in viewBox units. */
  bx: number;
  by: number;
  empire: boolean;
  conflict: boolean;
  tech: string;
  arch: string;
  culture: string;
};

type Region = {
  id: string;
  name: string;
  cx: number;
  cy: number;
  baseR: number;
  /** >1 stretches the territory horizontally. */
  aspect: number;
  periods: Period[];
};

/* Deterministic wobble, so the server and the browser draw the same outline. */
function hashNoise(seed: string, i: number): number {
  let h = 2166136261;
  const s = seed + ":" + i;
  for (let k = 0; k < s.length; k++) {
    h ^= s.charCodeAt(k);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000 - 0.5; // -0.5 .. 0.5
}

const REGIONS: Region[] = [
  {
    id: "americas", name: "The Americas", cx: 168, cy: 250, baseR: 74, aspect: 0.62,
    periods: [
      { from: -3000, to: -1200, name: "Norte Chico & early villages", color: "#8b5cf6", reach: 0.5, bx: 0, by: 30, empire: false, conflict: false, tech: "Cotton textiles", arch: "Earthen platform mounds with sunken plazas at Caral.", culture: "Reed flutes and knotted cords; no pottery yet found." },
      { from: -1200, to: -400, name: "Olmec civilisation", color: "#a855f7", reach: 0.55, bx: -4, by: -6, empire: false, conflict: false, tech: "Monumental stone carving", arch: "Ceremonial centres of packed earth at La Venta.", culture: "Colossal basalt heads and an early ballgame." },
      { from: -400, to: 250, name: "Zapotec, Chavín & Nazca", color: "#c084fc", reach: 0.62, bx: 0, by: 6, empire: false, conflict: false, tech: "Terrace irrigation", arch: "Monte Albán levels a mountain top into a plaza.", culture: "One of the earliest American writing systems." },
      { from: 250, to: 900, name: "Classic Maya & Teotihuacan", color: "#7c3aed", reach: 0.72, bx: -3, by: -10, empire: false, conflict: true, tech: "Positional astronomy", arch: "Stepped pyramids and a 4 km Avenue of the Dead.", culture: "Hieroglyphic writing and the Long Count calendar." },
      { from: 900, to: 1400, name: "Toltec, Wari & Mississippian", color: "#9333ea", reach: 0.8, bx: 2, by: 0, empire: false, conflict: true, tech: "Raised-field farming", arch: "Monks Mound at Cahokia, the largest earthwork in the Americas.", culture: "A shared ceremonial style along the Mississippi." },
      { from: 1400, to: 1533, name: "Aztec & Inca empires", color: "#6d28d9", reach: 0.95, bx: 0, by: 8, empire: true, conflict: true, tech: "Suspension bridges & quipu", arch: "Tenochtitlan on a lake; mortarless Inca stonework.", culture: "State storehouses, chinampas and knotted records." },
      { from: 1533, to: 1800, name: "Colonial period", color: "#64748b", reach: 1.0, bx: 0, by: 0, empire: true, conflict: true, tech: "Ocean-going sail", arch: "Cathedrals on the foundations of demolished temples.", culture: "Forced blending of languages, faiths and foods." },
      { from: 1800, to: 1900, name: "Independent republics", color: "#0ea5e9", reach: 1.02, bx: 0, by: 0, empire: false, conflict: true, tech: "Railways", arch: "Neoclassical capitols and the first long railways.", culture: "National literatures in Spanish, Portuguese and English." },
      { from: 1900, to: 2100, name: "Modern Americas", color: "#38bdf8", reach: 1.05, bx: 0, by: 0, empire: false, conflict: false, tech: "Electrification & flight", arch: "Steel-frame skyscrapers and continental highways.", culture: "Jazz, samba, reggae and hip-hop travel worldwide." },
    ],
  },
  {
    id: "europe", name: "Europe", cx: 496, cy: 132, baseR: 46, aspect: 1.35,
    periods: [
      { from: -3000, to: -800, name: "Minoan & Mycenaean Aegean", color: "#f59e0b", reach: 0.42, bx: 6, by: 18, empire: false, conflict: false, tech: "Bronze casting", arch: "The palace at Knossos; beehive tombs at Mycenae.", culture: "Linear A and Linear B; bull-leaping frescoes." },
      { from: -800, to: -323, name: "Greek city-states", color: "#fbbf24", reach: 0.58, bx: 8, by: 16, empire: false, conflict: true, tech: "Formal geometry", arch: "Doric and Ionic temples; the Parthenon.", culture: "Tragedy, philosophy and the Olympic games." },
      { from: -323, to: -27, name: "Hellenistic & Roman Republic", color: "#f97316", reach: 0.8, bx: 4, by: 10, empire: true, conflict: true, tech: "Aqueducts & concrete", arch: "The Library and Lighthouse at Alexandria.", culture: "Euclid, Archimedes and Eratosthenes." },
      { from: -27, to: 476, name: "Roman Empire", color: "#ea580c", reach: 1.18, bx: 0, by: 12, empire: true, conflict: true, tech: "Roman concrete & roads", arch: "The Colosseum and the Pantheon's concrete dome.", culture: "Latin literature, Roman law, spreading Christianity." },
      { from: 476, to: 1000, name: "Post-Roman kingdoms & Vikings", color: "#78716c", reach: 0.72, bx: -6, by: -6, empire: false, conflict: true, tech: "Clinker-built ships", arch: "Timber halls and the first Romanesque churches.", culture: "Illuminated manuscripts, sagas and oral law." },
      { from: 1000, to: 1350, name: "High Middle Ages", color: "#d97706", reach: 0.9, bx: 0, by: 0, empire: false, conflict: true, tech: "Heavy plough & watermills", arch: "Gothic cathedrals with flying buttresses.", culture: "Universities at Bologna, Paris and Oxford." },
      { from: 1350, to: 1650, name: "Renaissance & Reformation", color: "#facc15", reach: 0.95, bx: 0, by: 0, empire: false, conflict: true, tech: "Printing press", arch: "Brunelleschi's dome; St Peter's in Rome.", culture: "Leonardo, Copernicus, Galileo and Shakespeare." },
      { from: 1650, to: 1800, name: "Enlightenment & empire", color: "#fde047", reach: 1.0, bx: 0, by: 0, empire: true, conflict: true, tech: "Steam engine", arch: "Baroque palaces and the first factories.", culture: "Newton's Principia and Diderot's Encyclopédie." },
      { from: 1800, to: 1914, name: "Industrial Europe", color: "#f43f5e", reach: 1.15, bx: 0, by: 0, empire: true, conflict: true, tech: "Steel, rail & telegraph", arch: "Iron-and-glass train sheds; the Eiffel Tower.", culture: "Mass literacy, Darwin and Curie." },
      { from: 1914, to: 2100, name: "Wars and union", color: "#38bdf8", reach: 0.98, bx: 0, by: 0, empire: false, conflict: true, tech: "Computing & the Web", arch: "Modernist concrete and CERN's 27 km collider.", culture: "The welfare state and open borders." },
    ],
  },
  {
    id: "africa", name: "Africa", cx: 516, cy: 300, baseR: 76, aspect: 0.82,
    periods: [
      { from: -3000, to: -1070, name: "Ancient Egypt & Nubia", color: "#eab308", reach: 0.5, bx: 6, by: -34, empire: true, conflict: true, tech: "Surveying & papyrus", arch: "The Giza pyramids, cased in white limestone.", culture: "Hieroglyphs, a 365-day calendar and medicine." },
      { from: -1070, to: 350, name: "Kush, Carthage & Meroë", color: "#f59e0b", reach: 0.58, bx: 0, by: -28, empire: true, conflict: true, tech: "Iron smelting", arch: "Steep Nubian pyramids at Meroë.", culture: "Meroitic script, still only partly deciphered." },
      { from: 350, to: 700, name: "Kingdom of Aksum", color: "#84cc16", reach: 0.52, bx: 16, by: -18, empire: true, conflict: false, tech: "Coinage", arch: "Granite stelae up to 24 m tall, raised without mortar.", culture: "Ge'ez script; an early Christian state." },
      { from: 700, to: 1200, name: "Ghana Empire & Swahili coast", color: "#22c55e", reach: 0.72, bx: -10, by: -12, empire: true, conflict: false, tech: "Camel caravans", arch: "Coral-stone mosques at Kilwa and Lamu.", culture: "Swahili emerges as a language of trade." },
      { from: 1200, to: 1450, name: "Mali Empire & Great Zimbabwe", color: "#10b981", reach: 0.85, bx: -12, by: -8, empire: true, conflict: false, tech: "Gold metallurgy", arch: "Great Zimbabwe's mortarless granite walls.", culture: "Timbuktu's schools draw students across the Sahara." },
      { from: 1450, to: 1650, name: "Songhai & Benin", color: "#14b8a6", reach: 0.9, bx: -10, by: -4, empire: true, conflict: true, tech: "Lost-wax brass casting", arch: "Benin City's earthworks; Sankore's madrasa.", culture: "Tens of thousands of manuscripts on law and astronomy." },
      { from: 1650, to: 1880, name: "Asante, Oyo & the slave trade", color: "#71717a", reach: 0.86, bx: -6, by: 0, empire: true, conflict: true, tech: "Firearms trade", arch: "Gondar's stone castles in Ethiopia.", culture: "Adinkra symbols, kente cloth, manuscript painting." },
      { from: 1880, to: 1960, name: "Colonial rule", color: "#475569", reach: 1.0, bx: 0, by: 0, empire: true, conflict: true, tech: "Extractive railways", arch: "Rail lines from mines to ports, not between cities.", culture: "Resistance movements and anti-colonial writing." },
      { from: 1960, to: 2100, name: "Independence era", color: "#34d399", reach: 1.0, bx: 0, by: 0, empire: false, conflict: false, tech: "Mobile networks", arch: "New capitals and the Square Kilometre Array.", culture: "Afrobeat, Nollywood, the world's youngest population." },
    ],
  },
  {
    id: "middle-east", name: "The Middle East", cx: 604, cy: 208, baseR: 46, aspect: 1.15,
    periods: [
      { from: -3000, to: -2334, name: "Sumerian city-states", color: "#f87171", reach: 0.45, bx: 0, by: 4, empire: false, conflict: true, tech: "Writing & the wheel", arch: "Mud-brick ziggurats in stepped terraces.", culture: "Cuneiform, Gilgamesh, and base-60 counting." },
      { from: -2334, to: -1595, name: "Akkad & Babylon", color: "#ef4444", reach: 0.72, bx: 0, by: 2, empire: true, conflict: true, tech: "Bronze & irrigation canals", arch: "Palace complexes and city walls of fired brick.", culture: "Hammurabi's 282 laws, publicly displayed." },
      { from: -1595, to: -539, name: "Assyria & Neo-Babylon", color: "#dc2626", reach: 0.88, bx: -4, by: 0, empire: true, conflict: true, tech: "Iron weaponry", arch: "Nineveh's palaces and the glazed Ishtar Gate.", culture: "Ashurbanipal's library of clay tablets." },
      { from: -539, to: -330, name: "Achaemenid Persia", color: "#f97316", reach: 1.25, bx: 10, by: 0, empire: true, conflict: true, tech: "Royal road & relay post", arch: "Persepolis and its carved processions of tribute.", culture: "Zoroastrianism and tolerance of local religions." },
      { from: -330, to: 651, name: "Hellenistic, Parthian & Sasanian", color: "#fb923c", reach: 1.05, bx: 4, by: 0, empire: true, conflict: true, tech: "Windmills & qanats", arch: "Ctesiphon's brick arch, the widest ever built.", culture: "Astronomy translated between Greek, Syriac and Persian." },
      { from: 651, to: 1258, name: "Islamic caliphates", color: "#22d3ee", reach: 1.35, bx: -6, by: 4, empire: true, conflict: true, tech: "Paper & algebra", arch: "The Dome of the Rock; Córdoba's forest of arches.", culture: "Al-Khwarizmi's algebra; Ibn al-Haytham on light." },
      { from: 1258, to: 1517, name: "Mongol Ilkhanate & Mamluks", color: "#818cf8", reach: 1.0, bx: 8, by: -2, empire: true, conflict: true, tech: "Composite bow & post roads", arch: "Cairo's madrasas; Persian tilework.", culture: "Persian miniature painting and historical writing." },
      { from: 1517, to: 1918, name: "Ottoman Empire", color: "#a78bfa", reach: 1.15, bx: -8, by: -2, empire: true, conflict: true, tech: "Siege artillery", arch: "Sinan's great domed mosques.", culture: "Calligraphy, Iznik ceramics, a law for many faiths." },
      { from: 1918, to: 2100, name: "Modern states", color: "#38bdf8", reach: 1.0, bx: 0, by: 0, empire: false, conflict: true, tech: "Petroleum refining", arch: "Twentieth-century city building at huge scale.", culture: "Arabic, Persian, Turkish and Hebrew literature." },
    ],
  },
  {
    id: "south-asia", name: "South Asia", cx: 694, cy: 268, baseR: 44, aspect: 1.0,
    periods: [
      { from: -3000, to: -1900, name: "Indus Valley Civilisation", color: "#2dd4bf", reach: 0.62, bx: -8, by: -10, empire: false, conflict: false, tech: "Standardised bricks & drains", arch: "The Great Bath and granaries at Mohenjo-daro.", culture: "A script of ~400 signs, still undeciphered." },
      { from: -1900, to: -600, name: "Vedic period", color: "#5eead4", reach: 0.6, bx: -2, by: -6, empire: false, conflict: true, tech: "Iron tools", arch: "Timber and thatch; little survives above ground.", culture: "The Vedas, transmitted by memory for centuries." },
      { from: -600, to: -321, name: "Mahajanapadas", color: "#22d3ee", reach: 0.68, bx: 0, by: -2, empire: false, conflict: true, tech: "Punch-marked coinage", arch: "The first fortified cities of the Ganges basin.", culture: "Buddhism and Jainism founded; Pāṇini's grammar." },
      { from: -321, to: -185, name: "Maurya Empire", color: "#06b6d4", reach: 1.05, bx: 0, by: 0, empire: true, conflict: true, tech: "Polished stone & edict roads", arch: "Polished sandstone pillars; the stupa at Sanchi.", culture: "Ashoka's edicts carved in several languages." },
      { from: -185, to: 320, name: "Satavahana & Kushan kingdoms", color: "#0891b2", reach: 0.82, bx: 2, by: 4, empire: false, conflict: true, tech: "Deep-sea monsoon sailing", arch: "Buddhist caves at Karla and Bhaja cut into basalt.", culture: "Gandhara sculpture blends Greek and Indian styles." },
      { from: 320, to: 550, name: "Gupta Empire", color: "#0ea5e9", reach: 1.0, bx: 0, by: -2, empire: true, conflict: false, tech: "Decimal zero & metallurgy", arch: "Ajanta's caves; the rust-resistant iron pillar.", culture: "Aryabhata's astronomy; classical Sanskrit drama." },
      { from: 550, to: 1206, name: "Regional empires", color: "#3b82f6", reach: 0.92, bx: 0, by: 4, empire: true, conflict: true, tech: "Temple engineering", arch: "Brihadisvara at Thanjavur; Ellora's Kailasa.", culture: "Nalanda draws students from across Asia." },
      { from: 1206, to: 1526, name: "Delhi Sultanate & Vijayanagara", color: "#6366f1", reach: 0.96, bx: 0, by: 0, empire: true, conflict: true, tech: "Arch & dome construction", arch: "The Qutb Minar; Hampi's stone chariot.", culture: "Persian and Indian traditions blend in music and art." },
      { from: 1526, to: 1757, name: "Mughal Empire", color: "#8b5cf6", reach: 1.12, bx: 0, by: -2, empire: true, conflict: true, tech: "Cotton manufacture", arch: "The Taj Mahal, Fatehpur Sikri, the Red Fort.", culture: "Miniature painting, Urdu poetry, Akbar's debates." },
      { from: 1757, to: 1947, name: "British rule", color: "#64748b", reach: 1.05, bx: 0, by: 0, empire: true, conflict: true, tech: "Railways & telegraph", arch: "Railways, canals and colonial civic building.", culture: "Reform movements and a growing freedom struggle." },
      { from: 1947, to: 2100, name: "Independent South Asia", color: "#2dd4bf", reach: 1.0, bx: 0, by: 0, empire: false, conflict: true, tech: "Space & software", arch: "Chandigarh, new universities, ISRO launch complexes.", culture: "Cinema in dozens of languages; a written constitution." },
    ],
  },
  {
    id: "east-asia", name: "East Asia", cx: 812, cy: 190, baseR: 56, aspect: 1.2,
    periods: [
      { from: -3000, to: -1600, name: "Neolithic cultures", color: "#fb7185", reach: 0.5, bx: -6, by: 8, empire: false, conflict: false, tech: "Fast potter's wheel", arch: "Rammed-earth walls around large villages.", culture: "Jade carving of astonishing delicacy." },
      { from: -1600, to: -1046, name: "Shang dynasty", color: "#f43f5e", reach: 0.62, bx: -4, by: 6, empire: true, conflict: true, tech: "Bronze ritual casting", arch: "Palace platforms and royal tombs at Anyang.", culture: "Oracle-bone divination and the earliest Chinese script." },
      { from: -1046, to: -221, name: "Zhou & Warring States", color: "#ec4899", reach: 0.78, bx: 0, by: 4, empire: false, conflict: true, tech: "Cast iron & crossbow", arch: "The first long defensive walls.", culture: "Confucius, Laozi and Sunzi all write in this period." },
      { from: -221, to: 220, name: "Qin & Han dynasties", color: "#d946ef", reach: 1.1, bx: -4, by: 0, empire: true, conflict: true, tech: "Paper & the seismoscope", arch: "The terracotta army; canals on an enormous scale.", culture: "Standardised script, measures and coinage." },
      { from: 220, to: 589, name: "Division & migration", color: "#a855f7", reach: 0.82, bx: 2, by: 4, empire: false, conflict: true, tech: "Stirrup", arch: "Cave temples at Yungang and Longmen.", culture: "Calligraphy as high art; Buddhist texts translated." },
      { from: 589, to: 907, name: "Sui & Tang dynasties", color: "#f59e0b", reach: 1.15, bx: -6, by: -2, empire: true, conflict: true, tech: "Woodblock printing", arch: "The Grand Canal, 1,700 km north to south.", culture: "Tang poetry and an examination system for officials." },
      { from: 907, to: 1279, name: "Song dynasty", color: "#eab308", reach: 0.95, bx: 0, by: 6, empire: true, conflict: true, tech: "Gunpowder, compass, movable type", arch: "Multi-storey pagodas and the first cast-iron structures.", culture: "Landscape painting at its height." },
      { from: 1279, to: 1368, name: "Yuan dynasty (Mongol)", color: "#818cf8", reach: 1.35, bx: -8, by: -8, empire: true, conflict: true, tech: "Relay post & siege engines", arch: "Dadu, the grid city beneath modern Beijing.", culture: "Drama flourishes; foreign travellers arrive." },
      { from: 1368, to: 1644, name: "Ming dynasty", color: "#ef4444", reach: 1.08, bx: 0, by: 0, empire: true, conflict: true, tech: "Ocean-going treasure ships", arch: "The Forbidden City; the Great Wall in stone.", culture: "Blue-and-white porcelain becomes a global luxury." },
      { from: 1644, to: 1912, name: "Qing dynasty", color: "#f97316", reach: 1.2, bx: -2, by: -2, empire: true, conflict: true, tech: "Mass porcelain & tea", arch: "Imperial gardens and summer palaces.", culture: "Encyclopaedic compilations; Dream of the Red Chamber." },
      { from: 1912, to: 2100, name: "Modern East Asia", color: "#22d3ee", reach: 1.1, bx: 0, by: 0, empire: false, conflict: true, tech: "Semiconductors", arch: "High-speed rail and dense megacities.", culture: "Film, animation and music with global audiences." },
    ],
  },
];

/* -------------------------------------------------------------- trade routes */

type RouteDef = { id: string; label: string; from: number; to: number; d: string; color: string };

const ROUTES: RouteDef[] = [
  { id: "silk", label: "Silk Road", from: -130, to: 1450, color: "#fbbf24",
    d: "M 790 190 C 730 160, 680 175, 640 200 C 600 225, 545 205, 505 145" },
  { id: "indian-ocean", label: "Indian Ocean monsoon trade", from: -100, to: 1800, color: "#38bdf8",
    d: "M 700 300 C 660 340, 600 340, 555 320 C 520 305, 505 300, 520 285" },
  { id: "sahara", label: "Trans-Saharan gold & salt", from: 700, to: 1600, color: "#fde047",
    d: "M 470 300 C 480 270, 500 255, 530 250 C 555 246, 575 240, 590 230" },
  { id: "atlantic", label: "Atlantic crossings", from: 1492, to: 1900, color: "#f87171",
    d: "M 470 150 C 400 175, 320 200, 235 225" },
  { id: "steppe", label: "Steppe & Mongol routes", from: 1206, to: 1400, color: "#c4b5fd",
    d: "M 830 150 C 760 130, 690 150, 630 175 C 580 196, 540 180, 512 150" },
];

/* --------------------------------------------------- documented climate spans */

const CLIMATE: { from: number; to: number; label: string; dryness: number }[] = [
  { from: -2200, to: -1900, label: "4.2-kiloyear drought event", dryness: 0.8 },
  { from: 536, to: 660, label: "Late Antique Little Ice Age", dryness: 0.6 },
  { from: 950, to: 1250, label: "Medieval Warm Period", dryness: 0.15 },
  { from: 1300, to: 1850, label: "Little Ice Age", dryness: 0.45 },
];

const POPULATION: [number, number][] = [
  [-3000, 14], [-2000, 27], [-1000, 50], [-500, 100], [1, 190], [500, 190],
  [1000, 265], [1250, 400], [1500, 460], [1700, 610], [1800, 990],
  [1900, 1650], [1950, 2536], [2000, 6143], [2025, 8200],
];

/* -------------------------------------------------------------------- maths */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const mixed = pa.map((v, i) => Math.round(lerp(v, pb[i], t)));
  return "#" + mixed.map((v) => v.toString(16).padStart(2, "0")).join("");
}

function populationAt(year: number): number {
  if (year <= POPULATION[0][0]) return POPULATION[0][1];
  const last = POPULATION[POPULATION.length - 1];
  if (year >= last[0]) return last[1];
  for (let i = 1; i < POPULATION.length; i++) {
    const [y1, p1] = POPULATION[i - 1];
    const [y2, p2] = POPULATION[i];
    if (year <= y2) return lerp(p1, p2, (year - y1) / (y2 - y1));
  }
  return last[1];
}

function formatYear(year: number): string {
  const y = Math.round(year);
  if (y < 0) return Math.abs(y).toLocaleString("en-US") + " BCE";
  if (y === 0) return "1 CE";
  return y.toLocaleString("en-US") + " CE";
}

/** Wobble signature per region, computed once. */
const WOBBLE: Record<string, number[]> = Object.fromEntries(
  REGIONS.map((r) => [r.id, Array.from({ length: POINTS }, (_, i) => hashNoise(r.id, i))]),
);

/** Catmull-Rom through the ring, emitted as cubic Beziers — a closed organic outline. */
function smoothClosedPath(pts: [number, number][]): string {
  const n = pts.length;
  let d = "M " + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += " C " + c1x.toFixed(1) + " " + c1y.toFixed(1) + ", " + c2x.toFixed(1) + " " + c2y.toFixed(1) +
      ", " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
  }
  return d + " Z";
}

type Snapshot = {
  reach: number;
  bx: number;
  by: number;
  color: string;
  period: Period;
  next: Period;
  t: number;
};

/**
 * A territory holds its shape for most of an era, then transitions over the
 * last third — so an empire looks stable, then visibly gives way to what
 * follows, rather than drifting imperceptibly for six centuries.
 */
function snapshotAt(region: Region, year: number): Snapshot {
  const list = region.periods;
  let i = list.findIndex((p) => year >= p.from && year < p.to);
  if (i === -1) i = year < list[0].from ? 0 : list.length - 1;
  const cur = list[i];
  const next = list[Math.min(i + 1, list.length - 1)];
  const span = cur.to - cur.from;
  const progress = span > 0 ? (year - cur.from) / span : 1;
  const t = smoothstep(0.66, 1, progress);
  return {
    reach: lerp(cur.reach, next.reach, t),
    bx: lerp(cur.bx, next.bx, t),
    by: lerp(cur.by, next.by, t),
    color: mixHex(cur.color, next.color, t),
    period: t < 0.5 ? cur : next,
    next,
    t,
  };
}

function territoryPath(region: Region, s: Snapshot, breathe: number): string {
  const w = WOBBLE[region.id];
  const pts: [number, number][] = [];
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2;
    const r = region.baseR * s.reach * (1 + w[i] * 0.3 + Math.sin(breathe + i * 0.9) * 0.018);
    pts.push([
      region.cx + Math.cos(a) * r * region.aspect + s.bx,
      region.cy + Math.sin(a) * r + s.by,
    ]);
  }
  return smoothClosedPath(pts);
}

function climateAt(year: number) {
  const hit = CLIMATE.find((c) => year >= c.from && year < c.to);
  return hit ?? null;
}

/* ============================================================================
   Component
============================================================================ */

export default function LivingHistoryAtlas({ showIntro = true }: { showIntro?: boolean } = {}) {
  const reduceMotion = useReducedMotion();

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [audioOn, setAudioOn] = useState(false);
  const [zoomed, setZoomed] = useState<Region | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  /** Throttled mirror of the clock, for anything a human has to read. */
  const [display, setDisplay] = useState(() => ({
    year: START_YEAR,
    population: populationAt(START_YEAR),
    empires: 0,
    tech: [] as string[],
    climate: null as null | { label: string; dryness: number },
    names: {} as Record<string, string>,
  }));

  /* The authoritative clock lives in a ref — state at 60fps would thrash React. */
  const yearRef = useRef(START_YEAR);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const glowRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const fogRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const svgRef = useRef<SVGSVGElement | null>(null);
  const terrainRef = useRef<SVGRectElement | null>(null);
  const lastPanelPush = useRef(0);
  const elapsedRef = useRef(0);
  const audioRef = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);

  /* --------------------------------------------------------------- painting */

  const paint = useCallback(
    (year: number, elapsed: number, force = false) => {
      const breathe = reduceMotion ? 0 : elapsed * 0.6;
      let empires = 0;
      const tech: string[] = [];
      const names: Record<string, string> = {};

      for (const region of REGIONS) {
        const s = snapshotAt(region, year);
        const node = pathRefs.current[region.id];
        if (node) {
          node.setAttribute("d", territoryPath(region, s, breathe));
          node.setAttribute("fill", s.color);
          node.setAttribute("stroke", s.color);
        }
        const glow = glowRefs.current[region.id];
        if (glow) {
          glow.setAttribute("cx", String(region.cx + s.bx));
          glow.setAttribute("cy", String(region.cy + s.by));
          glow.setAttribute("r", String(region.baseR * s.reach * 1.1));
          glow.setAttribute("opacity", s.period.empire ? "0.28" : "0.06");
        }
        const fog = fogRefs.current[region.id];
        if (fog) {
          fog.setAttribute("cx", String(region.cx + s.bx));
          fog.setAttribute("cy", String(region.cy + s.by));
          fog.setAttribute("r", String(region.baseR * s.reach * 0.85));
          fog.setAttribute("opacity", s.period.conflict ? "0.3" : "0");
        }
        if (s.period.empire) empires++;
        if (!tech.includes(s.period.tech)) tech.push(s.period.tech);
        names[region.id] = s.period.name;
      }

      const clim = climateAt(year);
      if (terrainRef.current) {
        terrainRef.current.setAttribute("opacity", String(0.10 + (clim ? clim.dryness * 0.30 : 0)));
      }

      // Human-readable figures at 10Hz, not 60 — except on a manual scrub,
      // where the clock has not advanced but the reader is waiting.
      if (force || elapsed - lastPanelPush.current > 0.1) {
        lastPanelPush.current = elapsed;
        setDisplay({
          year,
          population: populationAt(year),
          empires,
          tech: tech.slice(0, 3),
          climate: clim,
          names,
        });
      }
    },
    [reduceMotion],
  );

  /* ------------------------------------------------------------ master clock */

  useEffect(() => {
    const tick = () => {
      const dt = gsap.ticker.deltaRatio(60) / 60; // seconds since last frame
      elapsedRef.current += dt;
      const elapsed = elapsedRef.current;
      if (playing) {
        yearRef.current += YEARS_PER_SECOND * speed * dt;
        if (yearRef.current >= END_YEAR) {
          yearRef.current = END_YEAR;
          setPlaying(false);
        }
      }
      paint(yearRef.current, elapsed);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [playing, speed, paint]);

  /* ------------------------------------------------------------------- zoom */

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const target = zoomed
      ? {
          x: zoomed.cx - zoomed.baseR * 2.1,
          y: zoomed.cy - zoomed.baseR * 1.5,
          w: zoomed.baseR * 4.2,
          h: zoomed.baseR * 3,
        }
      : { x: 0, y: 0, w: 1000, h: 470 };

    const current = (svg.getAttribute("viewBox") ?? "0 0 1000 470").split(" ").map(Number);
    const box = { x: current[0], y: current[1], w: current[2], h: current[3] };

    const tween = gsap.to(box, {
      ...target,
      duration: reduceMotion ? 0 : 0.8,
      ease: "power3.inOut",
      onUpdate: () => {
        svg.setAttribute(
          "viewBox",
          box.x.toFixed(1) + " " + box.y.toFixed(1) + " " + box.w.toFixed(1) + " " + box.h.toFixed(1),
        );
      },
    });
    /*
      The tween is the nice version; this is the guarantee. GSAP drives from
      requestAnimationFrame, which does not run in a background tab — without
      a fallback, clicking a region there would open the dashboard while the
      map silently failed to move. Zooming is the outcome; animating is only
      how it gets there.
    */
    const fallback = window.setTimeout(() => {
      if (tween.progress() < 1) {
        tween.kill();
        svg.setAttribute(
          "viewBox",
          target.x + " " + target.y + " " + target.w + " " + target.h,
        );
      }
    }, 1100);

    return () => {
      window.clearTimeout(fallback);
      tween.kill();
    };
  }, [zoomed, reduceMotion]);

  /* ------------------------------------------------------------------ audio */

  const toggleAudio = useCallback(() => {
    if (audioOn) {
      audioRef.current?.ctx.close();
      audioRef.current = null;
      setAudioOn(false);
      return;
    }
    /*
      Synthesised, not recorded — no audio files ship with this component.
      A low drone plus filtered noise reads as "distant weather" without ever
      becoming a startling noise in a classroom. It starts only on this click,
      which is also what browser autoplay rules require.
    */
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.5);

    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 96;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.5;
    drone.connect(droneGain).connect(master);
    drone.start();

    const fifth = ctx.createOscillator();
    fifth.type = "sine";
    fifth.frequency.value = 144;
    const fifthGain = ctx.createGain();
    fifthGain.gain.value = 0.18;
    fifth.connect(fifthGain).connect(master);
    fifth.start();

    // Two seconds of noise, looped and low-passed: a soft wash, like far-off sea.
    const frames = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.35;
    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start();

    audioRef.current = { ctx, master };
    setAudioOn(true);
  }, [audioOn]);

  // Never leave an AudioContext running after the component goes away.
  useEffect(() => () => { audioRef.current?.ctx.close(); }, []);

  /* ---------------------------------------------------------------- actions */

  /*
    Scrub and nudge repaint immediately rather than waiting for the next
    animation frame. Dragging the slider should feel attached to the pointer,
    and it means the map is never dependent on the ticker running to respond
    to a deliberate user action.
  */
  const scrub = useCallback(
    (year: number) => {
      yearRef.current = year;
      paint(year, elapsedRef.current, true);
    },
    [paint],
  );

  const nudge = useCallback(
    (delta: number) => {
      const next = Math.min(END_YEAR, Math.max(START_YEAR, yearRef.current + delta));
      yearRef.current = next;
      paint(next, elapsedRef.current, true);
    },
    [paint],
  );

  const activeRoutes = ROUTES.filter((r) => display.year >= r.from && display.year <= r.to);

  return (
    <div className="rounded-2xl bg-slate-950 p-4 text-slate-100 sm:p-6">
      <style>{`
        @keyframes atlas-flow { to { stroke-dashoffset: -240; } }
        .atlas-route { stroke-dasharray: 10 14; animation: atlas-flow 6s linear infinite; }
        @keyframes atlas-bead { to { offset-distance: 100%; } }
        .atlas-bead { offset-rotate: 0deg; animation: atlas-bead 7s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .atlas-route, .atlas-bead { animation: none !important; }
        }
      `}</style>

      {showIntro ? (
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">World history</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            Living History Atlas
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            Press play and watch territories grow, drift and give way across five thousand years.
          </p>
        </header>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        {/* --------------------------------- map --------------------------- */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10">
          <svg
            ref={svgRef}
            viewBox="0 0 1000 470"
            className="block h-auto w-full"
            role="group"
            aria-label="Animated map of world civilisations"
          >
            <defs>
              <radialGradient id="atlas-glow">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="atlas-fog">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* terrain wash — dries out during documented cold/dry episodes */}
            <rect
              ref={terrainRef}
              x={0} y={0} width={1000} height={470}
              fill="#a16207"
              opacity={0.1}
              className="transition-opacity duration-700 motion-reduce:transition-none"
            />

            <g aria-hidden opacity={0.22}>
              {Array.from({ length: 9 }, (_, i) => (
                <line key={"h" + i} x1={0} y1={i * 55} x2={1000} y2={i * 55} stroke="#1e293b" />
              ))}
              {Array.from({ length: 17 }, (_, i) => (
                <line key={"v" + i} x1={i * 62} y1={0} x2={i * 62} y2={470} stroke="#1e293b" />
              ))}
            </g>

            {/* golden haloes over flourishing capitals */}
            {REGIONS.map((r) => (
              <circle key={"g" + r.id} ref={(el) => { glowRefs.current[r.id] = el; }}
                fill="url(#atlas-glow)" opacity={0} pointerEvents="none" />
            ))}

            {/* territories */}
            {REGIONS.map((region) => (
              <g
                key={region.id}
                role="button"
                tabIndex={0}
                aria-label={region.name + ". Zoom in and open details."}
                onMouseOver={() => setHovered(region.id)}
                onMouseOut={() => setHovered(null)}
                onFocus={() => setHovered(region.id)}
                onBlur={() => setHovered(null)}
                onClick={() => setZoomed(region)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setZoomed(region); }
                }}
                className="cursor-pointer outline-none"
              >
                <path
                  ref={(el) => { pathRefs.current[region.id] = el; }}
                  /*
                    The opening frame is computed during render, not left blank
                    for the ticker to fill in. Otherwise the server ships empty
                    paths and the map is invisible until the animation loop's
                    first tick — or forever, if rAF never runs. breathe=0 keeps
                    it identical on server and client.
                  */
                  d={territoryPath(region, snapshotAt(region, START_YEAR), 0)}
                  fill={region.periods[0].color}
                  stroke={region.periods[0].color}
                  fillOpacity={hovered === region.id ? 0.95 : 0.72}
                  strokeWidth={hovered === region.id ? 4 : 1.5}
                  strokeOpacity={0.9}
                />
                <text
                  x={region.cx} y={region.cy}
                  textAnchor="middle"
                  pointerEvents="none"
                  className="fill-white/90 text-[14px] font-semibold"
                  style={{ paintOrder: "stroke", stroke: "rgba(2,6,23,0.7)", strokeWidth: 4 }}
                >
                  {region.name}
                </text>
              </g>
            ))}

            {/* smoke over active conflict */}
            {REGIONS.map((r) => (
              <circle key={"f" + r.id} ref={(el) => { fogRefs.current[r.id] = el; }}
                fill="url(#atlas-fog)" opacity={0} pointerEvents="none" />
            ))}

            {/* trade and migration routes */}
            {activeRoutes.map((route) => (
              <g key={route.id} aria-hidden>
                <path d={route.d} fill="none" stroke={route.color} strokeWidth={2}
                  strokeOpacity={0.75} className="atlas-route" />
                <circle r={3} fill={route.color} className="atlas-bead"
                  style={{ offsetPath: `path('${route.d}')` }} />
              </g>
            ))}
          </svg>

          {hovered ? (
            <div className="pointer-events-none absolute bottom-10 left-3 rounded-lg bg-slate-950/95 px-3 py-2 text-xs ring-1 ring-white/15">
              <p className="font-semibold text-white">
                {REGIONS.find((r) => r.id === hovered)?.name}
              </p>
              <p className="text-slate-300">{display.names[hovered]}</p>
            </div>
          ) : null}

          {zoomed ? (
            <button
              type="button"
              onClick={() => setZoomed(null)}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-slate-950/90 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-slate-800"
            >
              <ZoomOut className="h-3.5 w-3.5" aria-hidden /> Zoom out
            </button>
          ) : null}

          <p className="border-t border-white/10 px-4 py-2 text-[11px] text-slate-400">
            Schematic territories, not historical borders — shapes show roughly where and how far,
            never exactly.
          </p>
        </div>

        {/* ------------------------------ side panel ------------------------ */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
            <p className="font-display text-3xl font-semibold text-white tabular-nums">
              {formatYear(display.year)}
            </p>
            {display.climate ? (
              <p className="mt-1 text-xs font-semibold text-amber-400">{display.climate.label}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-900 p-3 ring-1 ring-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Population
              </p>
              <p className="mt-0.5 text-lg font-bold text-white tabular-nums">
                {display.population < 1000
                  ? Math.round(display.population) + "M"
                  : (display.population / 1000).toFixed(2) + "B"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-900 p-3 ring-1 ring-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active empires
              </p>
              <p className="mt-0.5 text-lg font-bold text-white tabular-nums">{display.empires}</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Gauge className="h-3.5 w-3.5" aria-hidden /> Dominant technologies
            </h3>
            <ul aria-live="polite" className="mt-2 space-y-1">
              {display.tech.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-slate-200">
                  <Sparkles className="h-3 w-3 shrink-0 text-amber-400" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Routes carrying goods now
            </h3>
            {activeRoutes.length ? (
              <ul className="mt-2 space-y-1">
                {activeRoutes.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm text-slate-200">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.color }} />
                    {r.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No long-distance routes mapped yet.</p>
            )}
          </div>
        </aside>
      </div>

      {/* ------------------------------- controls -------------------------- */}
      <div className="mt-5 rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
        <label htmlFor="atlas-scrub" className="sr-only">Year</label>
        <input
          id="atlas-scrub"
          type="range"
          min={START_YEAR}
          max={END_YEAR}
          step={1}
          defaultValue={START_YEAR}
          onChange={(e) => { setPlaying(false); scrub(Number(e.target.value)); }}
          aria-valuetext={formatYear(display.year)}
          className="w-full accent-amber-400"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>3000 BCE</span><span>1 CE</span><span>2025 CE</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={() => { setPlaying(false); scrub(START_YEAR); }}
            aria-label="Back to the beginning"
            className="rounded-lg bg-slate-800 p-2.5 text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
            <SkipBack className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={() => nudge(-200)} aria-label="Rewind 200 years"
            className="rounded-lg bg-slate-800 p-2.5 text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
            <Rewind className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}
            className="rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </button>
          {[1, 2, 5].map((s) => (
            <button key={s} type="button" onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
              className={"rounded-lg px-3 py-2.5 text-sm font-bold tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 " +
                (speed === s ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-200 hover:bg-slate-700")}>
              {s}×
            </button>
          ))}
          <button type="button" onClick={toggleAudio} aria-pressed={audioOn}
            aria-label={audioOn ? "Turn ambient sound off" : "Turn ambient sound on"}
            className="rounded-lg bg-slate-800 p-2.5 text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
            {audioOn ? <Volume2 className="h-4 w-4" aria-hidden /> : <VolumeX className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {/* ------------------------------ dashboard -------------------------- */}
      <AnimatePresence>
        {zoomed ? (
          <motion.div
            key={zoomed.id}
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-5 rounded-xl bg-slate-900 p-5 ring-1 ring-white/10"
          >
            {(() => {
              const s = snapshotAt(zoomed, display.year);
              return (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {zoomed.name} · {formatYear(display.year)}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold" style={{ color: s.color }}>
                        {s.period.name}
                      </h3>
                    </div>
                    <button type="button" onClick={() => setZoomed(null)} aria-label="Close details"
                      className="rounded-lg bg-slate-800 p-2 text-slate-300 transition-colors hover:bg-slate-700">
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: Landmark, label: "Architecture", value: s.period.arch },
                      { icon: ScrollText, label: "Culture", value: s.period.culture },
                      { icon: Gauge, label: "Technology", value: s.period.tech },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="rounded-lg bg-slate-800/60 p-3 ring-1 ring-white/5">
                        <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed text-slate-200">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              );
            })()}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="mt-5 rounded-lg bg-slate-900/70 px-4 py-3 text-xs leading-relaxed text-slate-400">
        <strong className="text-slate-200">How to read this:</strong> the shapes are schematic — they
        show roughly where a power held sway and how far it reached, never its actual borders. Dates
        are conventional and often disputed. The climate spans marked are real documented episodes;
        the terrain colour is an illustration of them, not measured data.
      </p>
    </div>
  );
}
