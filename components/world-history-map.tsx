"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FastForward,
  Landmark,
  Pause,
  Play,
  Rewind,
  Route,
  ScrollText,
  SkipBack,
  Sparkles,
  Users,
  X,
} from "lucide-react";

/* ============================================================================
   Animated World History Map Timeline

   A stylised map — six regions, drawn as rounded blobs, NOT accurate coastlines.
   The point is comparison across regions at one moment in time, so the shapes
   only need to be placed recognisably relative to one another. The footnote on
   the page says so plainly, because a map that looks authoritative and is not
   would be the wrong thing to teach from.

   Dates are conventional and often approximate: empires fade rather than end on
   a given afternoon, and historians disagree about many of these boundaries.
============================================================================ */

const START_YEAR = -3000;
const END_YEAR = 2025;
const STEP = 25;

type Period = {
  from: number;
  to: number;
  name: string;
  color: string;
  blurb: string;
  arch: string;
  culture: string;
  trade: string;
};

type Region = {
  id: string;
  name: string;
  /** Rounded-polygon path. Stroked with the same colour to soften the corners. */
  path: string;
  /** Where the hover card is anchored, in per cent of the map box. */
  labelX: number;
  labelY: number;
  periods: Period[];
};

const REGIONS: Region[] = [
  {
    id: "americas",
    name: "The Americas",
    path: "M150 62 L212 74 L236 132 L200 176 L178 216 L192 252 L216 302 L200 382 L166 432 L140 400 L152 332 L130 272 L106 220 L96 160 L112 96 Z",
    labelX: 17,
    labelY: 48,
    periods: [
      { from: -3000, to: -1200, name: "Norte Chico & early villages", color: "#8b5cf6",
        blurb: "Monumental mounds rise on the Peruvian coast — some as old as the Egyptian pyramids.",
        arch: "Earth and stone platform mounds with sunken circular plazas at Caral.",
        culture: "Cotton textiles and reed flutes; no pottery and no writing yet found.",
        trade: "Coastal fish traded inland for cotton and squash." },
      { from: -1200, to: -400, name: "Olmec civilisation", color: "#a855f7",
        blurb: "The Olmec carve colossal basalt heads and set patterns later cultures follow.",
        arch: "Ceremonial centres at San Lorenzo and La Venta built from packed earth.",
        culture: "Colossal portrait heads, jade masks, and an early ballgame.",
        trade: "Jade from Guatemala and obsidian moved hundreds of kilometres." },
      { from: -400, to: 250, name: "Zapotec, Chavín & Nazca", color: "#c084fc",
        blurb: "Hilltop cities, temple galleries in the Andes, and vast desert line drawings.",
        arch: "Monte Albán levels an entire mountain top into a plaza.",
        culture: "One of the earliest American writing systems appears in Oaxaca.",
        trade: "Llama caravans link highland and coastal goods." },
      { from: 250, to: 900, name: "Classic Maya & Teotihuacan", color: "#7c3aed",
        blurb: "Maya city-states track Venus; Teotihuacan grows into a city of 100,000.",
        arch: "Stepped pyramids, corbelled vaults, and a 4 km Avenue of the Dead.",
        culture: "Full hieroglyphic writing, the Long Count calendar, and bark-paper books.",
        trade: "Obsidian, cacao and quetzal feathers move along river and foot routes." },
      { from: 900, to: 1400, name: "Toltec, Wari & Mississippian", color: "#9333ea",
        blurb: "Cahokia becomes the largest city north of Mexico; Andean states expand.",
        arch: "Monks Mound at Cahokia is the largest earthwork in the Americas.",
        culture: "Shell gorgets, copper plates and a shared ceremonial style across the Mississippi.",
        trade: "Copper from the Great Lakes and shells from the Gulf reach the same towns." },
      { from: 1400, to: 1533, name: "Aztec & Inca empires", color: "#6d28d9",
        blurb: "Two of the largest empires on earth, built without wheels or draft animals.",
        arch: "Tenochtitlan on a lake; Inca stonework cut so closely it needs no mortar.",
        culture: "Quipu knotted records, chinampa farming, and state-run storehouses.",
        trade: "40,000 km of Inca road and canoe markets serving 200,000 people." },
      { from: 1533, to: 1800, name: "Colonial period", color: "#475569",
        blurb: "Invasion and introduced disease kill most of the population within a century.",
        arch: "Cathedrals raised on the foundations of demolished temples.",
        culture: "Languages, faiths and foods blend under enormous coercion.",
        trade: "Silver from Potosí flows to Europe and on to China." },
      { from: 1800, to: 1900, name: "Independent republics", color: "#0ea5e9",
        blurb: "Colonies break away one by one, though power stays with a small elite.",
        arch: "Neoclassical capitols and the first railways.",
        culture: "National literatures and newspapers in Spanish, Portuguese and English.",
        trade: "Cotton, coffee, sugar and beef exported to industrial Europe." },
      { from: 1900, to: 2100, name: "Modern Americas", color: "#38bdf8",
        blurb: "Industry, mass migration, civil rights movements and space flight.",
        arch: "Steel-frame skyscrapers and continent-spanning highways.",
        culture: "Jazz, samba, reggae and hip-hop travel worldwide.",
        trade: "Integrated continental supply chains and global finance." },
    ],
  },
  {
    id: "europe",
    name: "Europe",
    path: "M456 106 L520 100 L546 130 L530 166 L482 176 L450 156 Z",
    labelX: 49,
    labelY: 26,
    periods: [
      { from: -3000, to: -800, name: "Minoan & Mycenaean Aegean", color: "#f59e0b",
        blurb: "Palace societies on Crete and mainland Greece, then a long collapse.",
        arch: "The sprawling palace at Knossos; beehive tombs at Mycenae.",
        culture: "Linear A and Linear B script; bull-leaping frescoes.",
        trade: "Olive oil, wine and copper move across the eastern Mediterranean." },
      { from: -800, to: -323, name: "Greek city-states", color: "#fbbf24",
        blurb: "Athens experiments with direct democracy; Greek mathematics begins proving things.",
        arch: "Doric and Ionic temples; the Parthenon on the Acropolis.",
        culture: "Tragedy, philosophy, the Olympic games and formal geometry.",
        trade: "Colonies ring the Mediterranean and Black Sea, trading grain and pottery." },
      { from: -323, to: -27, name: "Hellenistic world & Roman Republic", color: "#f97316",
        blurb: "Greek culture spreads east; Rome grows from a city to a Mediterranean power.",
        arch: "The Library and Lighthouse at Alexandria; Roman aqueducts and concrete.",
        culture: "Euclid, Archimedes and Eratosthenes, who measured the Earth.",
        trade: "Grain fleets feed cities of half a million people." },
      { from: -27, to: 476, name: "Roman Empire", color: "#ea580c",
        blurb: "One state runs from Britain to the Euphrates, joined by roads and law.",
        arch: "The Colosseum, the Pantheon's concrete dome, and 80,000 km of road.",
        culture: "Latin literature, Roman law, and the spread of Christianity.",
        trade: "Silk from China and pepper from India reach Roman markets." },
      { from: 476, to: 1000, name: "Post-Roman kingdoms & Vikings", color: "#78716c",
        blurb: "Cities shrink, monasteries copy books, and Norse ships range from Kyiv to Newfoundland.",
        arch: "Timber halls, stone monasteries and the first Romanesque churches.",
        culture: "Illuminated manuscripts; sagas and oral law.",
        trade: "River routes carry furs and silver between the Baltic and Baghdad." },
      { from: 1000, to: 1350, name: "High Middle Ages", color: "#d97706",
        blurb: "Better ploughs feed a growing population; universities and cathedrals appear.",
        arch: "Gothic cathedrals with pointed arches, ribbed vaults and flying buttresses.",
        culture: "Universities at Bologna, Paris and Oxford; scholastic philosophy.",
        trade: "Champagne fairs and the Hanseatic League knit northern Europe together." },
      { from: 1350, to: 1650, name: "Renaissance & Reformation", color: "#facc15",
        blurb: "Printing makes ideas cheap; art, science and religion are all argued over.",
        arch: "Brunelleschi's dome in Florence; St Peter's in Rome.",
        culture: "Leonardo and Michelangelo; Copernicus and Galileo; Shakespeare.",
        trade: "Atlantic voyages open routes to the Americas and around Africa." },
      { from: 1650, to: 1800, name: "Enlightenment & empire", color: "#fde047",
        blurb: "Reason and evidence are argued to outrank tradition — while empires expand.",
        arch: "Baroque palaces and the first purpose-built factories.",
        culture: "Newton's Principia; Diderot's Encyclopédie; the first public museums.",
        trade: "Peak decades of the transatlantic trade in enslaved people." },
      { from: 1800, to: 1914, name: "Industrial Europe", color: "#f43f5e",
        blurb: "Steam, steel and railways reshape work, cities and the map of the world.",
        arch: "Iron and glass train sheds; the Eiffel Tower; tenement housing.",
        culture: "Mass literacy, newspapers, Darwin, Curie and public schooling.",
        trade: "European empires control much of Africa and Asia after 1885." },
      { from: 1914, to: 2100, name: "Wars and union", color: "#38bdf8",
        blurb: "Two catastrophic wars, then an experiment in cooperation between old enemies.",
        arch: "Modernist concrete, post-war rebuilding, and CERN's 27 km collider.",
        culture: "The welfare state, the World Wide Web, and open borders.",
        trade: "A single European market replaces centuries of tariff walls." },
    ],
  },
  {
    id: "africa",
    name: "Africa",
    path: "M470 216 L546 206 L576 246 L560 312 L520 382 L490 412 L466 360 L456 290 Z",
    labelX: 52,
    labelY: 60,
    periods: [
      { from: -3000, to: -1070, name: "Ancient Egypt & Nubia", color: "#eab308",
        blurb: "The Nile's yearly flood supports one of the world's first unified states.",
        arch: "The Giza pyramids, cased in smooth white limestone; temples at Karnak.",
        culture: "Hieroglyphs, papyrus, a 365-day calendar and advanced medicine.",
        trade: "Gold and granite downriver; incense and ebony from Punt and Nubia." },
      { from: -1070, to: 350, name: "Kush, Carthage & Meroë", color: "#f59e0b",
        blurb: "Kushite kings rule Egypt itself; Carthage dominates Mediterranean trade.",
        arch: "Steep Nubian pyramids at Meroë; Carthaginian harbours and walls.",
        culture: "Meroitic script — still only partly deciphered.",
        trade: "Meroë becomes a major ironworking centre; Carthage links three continents." },
      { from: 350, to: 700, name: "Kingdom of Aksum", color: "#84cc16",
        blurb: "An Ethiopian power minting its own coins and trading across the Red Sea.",
        arch: "Carved granite stelae up to 24 m tall, raised without mortar.",
        culture: "Ge'ez script; one of the earliest states to adopt Christianity.",
        trade: "Ivory and gold exchanged for Roman glass and Indian textiles." },
      { from: 700, to: 1200, name: "Ghana Empire & Swahili coast", color: "#22c55e",
        blurb: "Gold and salt cross the Sahara; monsoon winds carry ships to India and China.",
        arch: "Mud-brick towns inland; coral-stone mosques at Kilwa and Lamu.",
        culture: "Swahili emerges as a trading language along the coast.",
        trade: "Salt traded weight for weight against gold at the desert's edge." },
      { from: 1200, to: 1450, name: "Mali Empire & Great Zimbabwe", color: "#10b981",
        blurb: "Mansa Musa's pilgrimage makes Mali famous; a stone city rises in the south.",
        arch: "Great Zimbabwe's mortarless granite walls; the Djinguereber mosque.",
        culture: "Timbuktu's schools attract students from across the Sahara.",
        trade: "Gold, copper and Chinese porcelain all reach Great Zimbabwe." },
      { from: 1450, to: 1650, name: "Songhai & Benin", color: "#14b8a6",
        blurb: "Songhai becomes one of Africa's largest empires; Benin casts extraordinary brass.",
        arch: "Benin City's earthworks; Sankore's mud-brick madrasa in Timbuktu.",
        culture: "Tens of thousands of manuscripts on law, astronomy and medicine.",
        trade: "Portuguese ships arrive; Atlantic trade begins to pull trade off the desert routes." },
      { from: 1650, to: 1880, name: "Asante, Oyo & the slave trade", color: "#64748b",
        blurb: "New states rise on Atlantic trade, while millions are taken from the continent.",
        arch: "Gondar's stone castles in Ethiopia; Asante courtyard architecture.",
        culture: "Adinkra symbols, kente cloth and Ethiopian manuscript painting.",
        trade: "The eighteenth century is the peak of the transatlantic slave trade." },
      { from: 1880, to: 1960, name: "Colonial rule", color: "#475569",
        blurb: "Almost the whole continent is divided between European powers in about 25 years.",
        arch: "Railways built from mines to ports, not between African cities.",
        culture: "Resistance movements and a flowering of anti-colonial writing.",
        trade: "Resources extracted outward; Ethiopia stays independent after Adwa in 1896." },
      { from: 1960, to: 2100, name: "Independence era", color: "#34d399",
        blurb: "Ghana leads in 1957 and most of the continent follows within a decade.",
        arch: "New capitals, universities and the Square Kilometre Array in the Karoo.",
        culture: "Afrobeat, Nollywood, and a continent with the world's youngest population.",
        trade: "M-Pesa mobile money reaches millions who never had a bank account." },
    ],
  },
  {
    id: "middle-east",
    name: "The Middle East",
    path: "M560 186 L626 180 L652 216 L620 250 L576 246 L556 216 Z",
    labelX: 60,
    labelY: 42,
    periods: [
      { from: -3000, to: -2334, name: "Sumerian city-states", color: "#f87171",
        blurb: "Writing is invented in Mesopotamia — first for accounting, not for stories.",
        arch: "Mud-brick ziggurats rising in stepped terraces above the plain.",
        culture: "Cuneiform on clay; the Epic of Gilgamesh; base-60 counting we still use for time.",
        trade: "Barley and wool exchanged for timber, copper and lapis lazuli." },
      { from: -2334, to: -1595, name: "Akkad & Babylon", color: "#ef4444",
        blurb: "Sargon builds one of the first empires; Hammurabi has his laws carved in stone.",
        arch: "Palace complexes and city walls of fired brick.",
        culture: "Hammurabi's code — 282 laws, publicly displayed.",
        trade: "Caravan routes to the Indus Valley and the Persian Gulf." },
      { from: -1595, to: -539, name: "Assyria & Neo-Babylon", color: "#dc2626",
        blurb: "Iron-armed empires rise and fall between the Nile and the Zagros.",
        arch: "Nineveh's palaces and the Ishtar Gate's glazed blue brick.",
        culture: "Ashurbanipal's library gathers thousands of clay tablets.",
        trade: "Tribute and long-distance roads knit an empire of provinces." },
      { from: -539, to: -330, name: "Achaemenid Persia", color: "#f97316",
        blurb: "The largest empire the world had yet seen, run through satraps and a royal road.",
        arch: "Persepolis, with columned halls and carved processions of tribute-bearers.",
        culture: "Zoroastrianism; official tolerance of local religions.",
        trade: "A 2,700 km Royal Road crossed in about a week by relay riders." },
      { from: -330, to: 651, name: "Hellenistic, Parthian & Sasanian", color: "#fb923c",
        blurb: "Greek, Persian and Roman worlds meet, mix and fight along the same frontier.",
        arch: "Ctesiphon's vast brick arch — the widest of its kind ever built.",
        culture: "Astronomy and medicine translated between Greek, Syriac and Persian.",
        trade: "The Silk Road's western half runs through Parthian and Sasanian hands." },
      { from: 651, to: 1258, name: "Islamic caliphates", color: "#22d3ee",
        blurb: "Baghdad becomes a centre of learning where Greek and Indian knowledge is joined.",
        arch: "The Dome of the Rock; the Great Mosque of Córdoba's forest of arches.",
        culture: "Al-Khwarizmi's algebra; Ibn al-Haytham's experiments on light.",
        trade: "Paper-making arrives from China and spreads west from Samarkand." },
      { from: 1258, to: 1517, name: "Mongol Ilkhanate & Mamluks", color: "#818cf8",
        blurb: "Mongol armies sack Baghdad; Mamluk Egypt holds the line and prospers.",
        arch: "Cairo's madrasas and mausoleums; Persian tilework under the Ilkhans.",
        culture: "Persian miniature painting and historical writing flourish.",
        trade: "The Mongol peace briefly makes overland Eurasian travel safer." },
      { from: 1517, to: 1918, name: "Ottoman Empire", color: "#a78bfa",
        blurb: "Six centuries of rule across three continents, centred on Istanbul.",
        arch: "Sinan's great domed mosques, answering and rivalling Hagia Sophia.",
        culture: "Calligraphy, Iznik ceramics, and a legal system for many faiths.",
        trade: "Control of the land routes east pushes Europe to seek sea routes." },
      { from: 1918, to: 2100, name: "Modern states", color: "#38bdf8",
        blurb: "New borders drawn after 1918; oil reshapes the region's place in the world.",
        arch: "Rapid twentieth-century city building on an unprecedented scale.",
        culture: "Arabic, Persian, Turkish and Hebrew literature and cinema.",
        trade: "Petroleum becomes the single most traded commodity on earth." },
    ],
  },
  {
    id: "south-asia",
    name: "South Asia",
    path: "M656 246 L716 240 L736 276 L710 330 L676 316 L656 280 Z",
    labelX: 69,
    labelY: 55,
    periods: [
      { from: -3000, to: -1900, name: "Indus Valley Civilisation", color: "#2dd4bf",
        blurb: "Cities with grid streets and covered drains, built before Rome existed.",
        arch: "Standardised fired bricks; the Great Bath and granaries at Mohenjo-daro.",
        culture: "A script of about 400 signs that nobody has yet deciphered.",
        trade: "Carnelian beads and seals reach Mesopotamia by sea and land." },
      { from: -1900, to: -600, name: "Vedic period", color: "#5eead4",
        blurb: "Oral traditions are composed and memorised with extraordinary precision.",
        arch: "Mostly timber and thatch — little survives above ground.",
        culture: "The Vedas, transmitted by memory for centuries before being written.",
        trade: "Cattle wealth and river routes across the Gangetic plain." },
      { from: -600, to: -321, name: "Mahajanapadas", color: "#22d3ee",
        blurb: "Sixteen great states compete; the Buddha and Mahavira teach in the same century.",
        arch: "The first fortified cities of the Ganges basin, with rammed-earth ramparts.",
        culture: "Buddhism and Jainism founded; Pāṇini writes his grammar of Sanskrit.",
        trade: "Punch-marked silver coins appear — some of India's earliest currency." },
      { from: -321, to: -185, name: "Maurya Empire", color: "#06b6d4",
        blurb: "Ashoka rules most of the subcontinent, then renounces conquest after Kalinga.",
        arch: "Polished sandstone pillars; the great stupa at Sanchi.",
        culture: "Ashoka's edicts carved in rock in several languages and scripts.",
        trade: "Royal roads link Pataliputra to the northwest passes." },
      { from: -185, to: 320, name: "Satavahana & Kushan kingdoms", color: "#0891b2",
        blurb: "After the Mauryas, regional powers hold the Deccan and the northwest.",
        arch: "The Buddhist caves at Karla and Bhaja, cut into basalt cliffs.",
        culture: "Gandhara sculpture blends Greek and Indian styles.",
        trade: "Roman gold coins reach south India in exchange for pepper and cotton." },
      { from: 320, to: 550, name: "Gupta Empire", color: "#0ea5e9",
        blurb: "A period so productive in mathematics and art it is often called a golden age.",
        arch: "Rock-cut caves at Ajanta; the rust-resistant iron pillar of Delhi.",
        culture: "Aryabhata's astronomy; the decimal place-value system with zero.",
        trade: "Indian textiles and spices reach Rome; Buddhism travels the Silk Road." },
      { from: 550, to: 1206, name: "Regional empires", color: "#3b82f6",
        blurb: "Chola, Chalukya, Rashtrakuta and Pala courts compete in temple building and learning.",
        arch: "The Brihadisvara temple at Thanjavur; Ellora's Kailasa, cut from one rock.",
        culture: "Tamil and Sanskrit literature; Nalanda draws students from across Asia.",
        trade: "Chola fleets reach Southeast Asia; Indian numerals travel west to Baghdad." },
      { from: 1206, to: 1526, name: "Delhi Sultanate & Vijayanagara", color: "#6366f1",
        blurb: "New dynasties in the north; a vast southern capital at Hampi.",
        arch: "The Qutb Minar; Hampi's stone chariot and market streets.",
        culture: "Persian and Indian traditions blend in music, painting and language.",
        trade: "Horses imported by sea; cotton and pepper exported west." },
      { from: 1526, to: 1757, name: "Mughal Empire", color: "#8b5cf6",
        blurb: "One of the wealthiest states on earth, producing perhaps a quarter of world output.",
        arch: "The Taj Mahal, Fatehpur Sikri, and the Red Fort at Delhi.",
        culture: "Miniature painting, Urdu poetry, and Akbar's debates between faiths.",
        trade: "Bengal cotton clothes much of the world before industrial Britain." },
      { from: 1757, to: 1947, name: "British rule", color: "#475569",
        blurb: "Company rule after Plassey becomes direct empire; India's share of world output falls sharply.",
        arch: "Railways, canals and colonial civic architecture.",
        culture: "Reform movements, printing in many languages, and a growing freedom struggle.",
        trade: "Raw cotton exported, finished cloth imported — reversing the old pattern." },
      { from: 1947, to: 2100, name: "Independent South Asia", color: "#2dd4bf",
        blurb: "Independence in 1947, partition, and the growth of the world's largest democracy.",
        arch: "Chandigarh, new universities, and the ISRO launch complexes.",
        culture: "Cinema in dozens of languages; a constitution written in under three years.",
        trade: "Software and services exports; Chandrayaan-3 lands near the Moon's south pole in 2023." },
    ],
  },
  {
    id: "east-asia",
    name: "East Asia",
    path: "M740 140 L830 130 L882 166 L870 226 L810 266 L756 250 L730 200 Z",
    labelX: 81,
    labelY: 38,
    periods: [
      { from: -3000, to: -1600, name: "Neolithic cultures", color: "#fb7185",
        blurb: "Longshan potters make black eggshell-thin cups on fast wheels.",
        arch: "Rammed-earth walls around large villages.",
        culture: "Jade carving of astonishing delicacy; early ancestor ritual.",
        trade: "Jade and shell move hundreds of kilometres between river valleys." },
      { from: -1600, to: -1046, name: "Shang dynasty", color: "#f43f5e",
        blurb: "The earliest Chinese writing yet found is scratched on oracle bones.",
        arch: "Palace platforms and enormous royal tombs at Anyang.",
        culture: "Oracle-bone divination; bronze ritual vessels of great complexity.",
        trade: "Bronze needs tin and copper, drawing in long-distance supply." },
      { from: -1046, to: -221, name: "Zhou & Warring States", color: "#ec4899",
        blurb: "Political chaos coincides with the richest period of Chinese philosophy.",
        arch: "The first long defensive walls, later joined into the Great Wall.",
        culture: "Confucius, Laozi and Sunzi all write in this period.",
        trade: "Iron ploughs and coinage spread across competing states." },
      { from: -221, to: 220, name: "Qin & Han dynasties", color: "#d946ef",
        blurb: "China is unified, and the Silk Road opens all the way to Rome.",
        arch: "The terracotta army; walls, roads and canals on an enormous scale.",
        culture: "Paper invented around 105 CE; standardised script and measures.",
        trade: "Silk reaches Rome, where senators complain about the cost." },
      { from: 220, to: 589, name: "Division & migration", color: "#a855f7",
        blurb: "Three centuries of divided rule, and Buddhism takes root across China.",
        arch: "Cave temples at Yungang and Longmen, carved into cliffs.",
        culture: "Calligraphy becomes a high art; Buddhist texts translated from Sanskrit.",
        trade: "Pilgrims and monks travel the Silk Road in both directions." },
      { from: 589, to: 907, name: "Sui & Tang dynasties", color: "#f59e0b",
        blurb: "Chang'an is perhaps the largest and most cosmopolitan city on earth.",
        arch: "The Grand Canal — 1,700 km linking north and south.",
        culture: "Woodblock printing; Tang poetry; an examination system for officials.",
        trade: "Merchants from Persia, India and Japan live in the capital." },
      { from: 907, to: 1279, name: "Song dynasty", color: "#eab308",
        blurb: "Gunpowder, the compass and movable type all come into use.",
        arch: "Multi-storey pagodas; the first cast-iron structures.",
        culture: "Bi Sheng's movable type around 1040; landscape painting at its height.",
        trade: "The world's first government-issued paper money." },
      { from: 1279, to: 1368, name: "Yuan dynasty (Mongol)", color: "#818cf8",
        blurb: "China becomes part of the largest contiguous land empire in history.",
        arch: "Dadu — the grid city beneath modern Beijing.",
        culture: "Drama flourishes; foreign travellers such as Marco Polo arrive.",
        trade: "The Mongol peace makes overland Eurasian trade safer for a century." },
      { from: 1368, to: 1644, name: "Ming dynasty", color: "#ef4444",
        blurb: "Zheng He's fleets reach East Africa decades before Columbus sails.",
        arch: "The Forbidden City; the Great Wall rebuilt in stone and brick.",
        culture: "Blue-and-white porcelain becomes a global luxury.",
        trade: "American silver flows into China in exchange for silk and porcelain." },
      { from: 1644, to: 1912, name: "Qing dynasty", color: "#f97316",
        blurb: "The largest economy on earth for much of this period, then a century of crisis.",
        arch: "Imperial gardens and summer palaces on a vast scale.",
        culture: "Encyclopaedic compilation projects; the novel Dream of the Red Chamber.",
        trade: "Tea for silver, then the opium wars and forced treaty ports." },
      { from: 1912, to: 2100, name: "Modern East Asia", color: "#22d3ee",
        blurb: "Revolution, war, and then some of the fastest industrial growth ever recorded.",
        arch: "High-speed rail networks and dense megacities.",
        culture: "Mass literacy; film, animation and popular music with global audiences.",
        trade: "The region manufactures most of the world's electronics." },
    ],
  },
];

/* ---------------------------------------------------------------- world eras */

const WORLD_ERAS: { from: number; to: number; title: string; narrative: string }[] = [
  { from: -3000, to: -2000, title: "The first cities", narrative: "Writing, the wheel and irrigated farming appear independently in several river valleys. Most people everywhere still farm." },
  { from: -2000, to: -1000, title: "Bronze Age palaces", narrative: "Palace states trade tin and copper across long distances. Around 1200 BCE many of them collapse within a few decades." },
  { from: -1000, to: -300, title: "Iron, coins and philosophy", narrative: "Iron tools spread, coinage is invented, and Confucius, the Buddha and Greek philosophers all teach within a few centuries." },
  { from: -300, to: 300, title: "Empires of the classical world", narrative: "Rome, Han China, Parthia and Maurya India hold most of Eurasia's population between them, joined by the Silk Road." },
  { from: 300, to: 800, title: "Migration and new faiths", narrative: "Old empires fragment. Buddhism, Christianity and Islam each spread far beyond where they began." },
  { from: 800, to: 1200, title: "A connected Old World", narrative: "Baghdad, Chang'an, Cairo and Constantinople are among the largest cities on earth, and knowledge moves between them." },
  { from: 1200, to: 1400, title: "The Mongol century and the plague", narrative: "One empire briefly spans Eurasia, making travel safer — and helping the Black Death travel with it." },
  { from: 1400, to: 1600, title: "Oceans joined", narrative: "Chinese, Arab and European fleets cross open ocean. Contact between hemispheres brings exchange, invasion and catastrophic epidemics." },
  { from: 1600, to: 1800, title: "Empires, silver and slavery", narrative: "Global trade in silver, sugar and enslaved people links four continents. Scientific method takes hold in Europe." },
  { from: 1800, to: 1914, title: "Industry and empire", narrative: "Steam and steel multiply what a person can produce, while a handful of states come to rule most of the world's land." },
  { from: 1914, to: 1945, title: "Two world wars", narrative: "Industrial capacity is turned on human beings. Empires begin to break apart under the strain." },
  { from: 1945, to: 2100, title: "Decolonisation and the digital age", narrative: "Dozens of nations become independent, world population triples, and computers connect almost everyone alive." },
];

/* -------------------------------------------------------------- milestones */

const MILESTONES: { year: number; text: string }[] = [
  { year: -3200, text: "Cuneiform writing in Sumer" },
  { year: -3000, text: "Bronze casting spreads in Western Asia" },
  { year: -2560, text: "Great Pyramid of Giza completed" },
  { year: -2000, text: "Indus cities at their height" },
  { year: -1750, text: "Hammurabi's law code carved in stone" },
  { year: -1200, text: "Bronze Age collapse across the Mediterranean" },
  { year: -800, text: "Alphabetic writing spreads with Phoenician traders" },
  { year: -600, text: "Coinage invented in Lydia" },
  { year: -500, text: "Athenian democracy; Pāṇini's Sanskrit grammar" },
  { year: -250, text: "Ashoka's rock edicts; Archimedes at Syracuse" },
  { year: -100, text: "Silk Road links Han China and Rome" },
  { year: 105, text: "Paper-making recorded in China" },
  { year: 476, text: "Western Roman Empire ends" },
  { year: 500, text: "Decimal place-value system in use in India" },
  { year: 762, text: "Baghdad founded; House of Wisdom follows" },
  { year: 868, text: "Diamond Sutra — earliest dated printed book" },
  { year: 1040, text: "Bi Sheng's movable type in Song China" },
  { year: 1088, text: "University of Bologna founded" },
  { year: 1206, text: "Mongol Empire begins its expansion" },
  { year: 1347, text: "Black Death reaches Europe" },
  { year: 1405, text: "Zheng He's first treasure voyage" },
  { year: 1440, text: "Gutenberg's printing press in Europe" },
  { year: 1492, text: "Columbus crosses the Atlantic" },
  { year: 1498, text: "Vasco da Gama reaches India by sea" },
  { year: 1543, text: "Copernicus places the Sun at the centre" },
  { year: 1687, text: "Newton publishes the Principia" },
  { year: 1769, text: "Watt's improved steam engine patented" },
  { year: 1804, text: "First steam locomotive runs" },
  { year: 1859, text: "Darwin publishes On the Origin of Species" },
  { year: 1876, text: "Telephone patented" },
  { year: 1895, text: "Röntgen discovers X-rays" },
  { year: 1903, text: "First powered aeroplane flight" },
  { year: 1928, text: "Penicillin discovered" },
  { year: 1947, text: "Indian independence; the transistor invented" },
  { year: 1953, text: "Structure of DNA described" },
  { year: 1969, text: "Apollo 11 lands on the Moon" },
  { year: 1989, text: "World Wide Web proposed at CERN" },
  { year: 2003, text: "Human Genome Project completed" },
  { year: 2023, text: "Chandrayaan-3 lands near the Moon's south pole" },
];

/* -------------------------------------------------------------- population */

/** World population estimates in millions (McEvedy & Jones; UN for recent years). */
const POPULATION: [number, number][] = [
  [-3000, 14], [-2000, 27], [-1000, 50], [-500, 100], [1, 190], [500, 190],
  [1000, 265], [1250, 400], [1500, 460], [1700, 610], [1800, 990],
  [1900, 1650], [1950, 2536], [2000, 6143], [2025, 8200],
];

function populationAt(year: number): number {
  if (year <= POPULATION[0][0]) return POPULATION[0][1];
  const last = POPULATION[POPULATION.length - 1];
  if (year >= last[0]) return last[1];
  for (let i = 1; i < POPULATION.length; i++) {
    const [y1, p1] = POPULATION[i - 1];
    const [y2, p2] = POPULATION[i];
    if (year <= y2) return p1 + ((year - y1) / (y2 - y1)) * (p2 - p1);
  }
  return last[1];
}

/* ------------------------------------------------------------------ helpers */

function formatYear(year: number): string {
  if (year < 0) return Math.abs(year).toLocaleString("en-US") + " BCE";
  if (year === 0) return "1 CE";
  return year.toLocaleString("en-US") + " CE";
}

function periodAt(region: Region, year: number): Period {
  return (
    region.periods.find((p) => year >= p.from && year < p.to) ??
    region.periods[region.periods.length - 1]
  );
}

function eraAt(year: number) {
  return WORLD_ERAS.find((e) => year >= e.from && year < e.to) ?? WORLD_ERAS[WORLD_ERAS.length - 1];
}

/* ============================================================================
   Component
============================================================================ */

export default function WorldHistoryMap({ showIntro = true }: { showIntro?: boolean } = {}) {
  const [year, setYear] = useState(START_YEAR);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openRegion, setOpenRegion] = useState<Region | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const returnFocusRef = useRef<SVGGElement | null>(null);

  /* --- playback ---------------------------------------------------------- */
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setYear((y) => {
        const next = y + STEP;
        if (next >= END_YEAR) {
          setPlaying(false);
          return END_YEAR;
        }
        return next;
      });
    }, 140 / speed);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  const nudge = useCallback((delta: number) => {
    setYear((y) => Math.min(END_YEAR, Math.max(START_YEAR, y + delta)));
  }, []);

  /* --- modal ------------------------------------------------------------- */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openRegion && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openRegion]);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
    setOpenRegion(null);
    document.body.style.overflow = "";
    returnFocusRef.current?.focus();
  }, []);

  const era = eraAt(year);
  const population = populationAt(year);

  const recentMilestones = useMemo(
    () => MILESTONES.filter((m) => m.year <= year).slice(-5).reverse(),
    [year],
  );

  const density =
    population < 100 ? "Sparse" : population < 500 ? "Growing" : population < 2000 ? "Crowded" : "Dense";

  const hoveredRegion = hovered ? REGIONS.find((r) => r.id === hovered) ?? null : null;

  return (
    <div className="rounded-2xl bg-slate-950 p-4 text-slate-100 sm:p-6">
      {showIntro ? (
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
            World history
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            Animated World History Map
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            Drag the slider or press play, and watch six regions of the world change together.
            Hover a region to see who was there; click it to look closer.
          </p>
        </header>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* ------------------------------- Map ------------------------------ */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10">
          <svg
            viewBox="0 0 1000 470"
            className="block h-auto w-full"
            role="group"
            aria-label={"Stylised world map showing dominant civilisations in " + formatYear(year)}
          >
            {/* faint grid, purely decorative */}
            <g aria-hidden opacity={0.25}>
              {Array.from({ length: 9 }, (_, i) => (
                <line key={"h" + i} x1={0} y1={i * 55} x2={1000} y2={i * 55} stroke="#1e293b" strokeWidth={1} />
              ))}
              {Array.from({ length: 17 }, (_, i) => (
                <line key={"v" + i} x1={i * 62} y1={0} x2={i * 62} y2={470} stroke="#1e293b" strokeWidth={1} />
              ))}
            </g>

            {REGIONS.map((region) => {
              const period = periodAt(region, year);
              const isHovered = hovered === region.id;
              return (
                <g
                  key={region.id}
                  role="button"
                  tabIndex={0}
                  aria-label={region.name + " — " + period.name + ". Open details."}
                  onMouseEnter={() => setHovered(region.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={(e) => {
                    setHovered(region.id);
                    returnFocusRef.current = e.currentTarget;
                  }}
                  onBlur={() => setHovered(null)}
                  onClick={(e) => {
                    returnFocusRef.current = e.currentTarget;
                    setOpenRegion(region);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      returnFocusRef.current = e.currentTarget;
                      setOpenRegion(region);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <path
                    d={region.path}
                    fill={period.color}
                    stroke={period.color}
                    strokeWidth={16}
                    strokeLinejoin="round"
                    /*
                      The colour blend is the whole point of the timeline, so the
                      transition sits on fill and stroke together.
                    */
                    className="transition-all duration-500 ease-out motion-reduce:transition-none"
                    opacity={isHovered ? 1 : 0.85}
                  />
                  {isHovered ? (
                    <path
                      d={region.path}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={22}
                      strokeLinejoin="round"
                      opacity={0.35}
                      pointerEvents="none"
                    />
                  ) : null}
                  {/*
                    Without a name on each shape the map reads as abstract
                    blobs — a student should not have to hover to find out
                    which continent they are looking at.
                  */}
                  <text
                    x={(region.labelX / 100) * 1000}
                    y={(region.labelY / 100) * 470}
                    textAnchor="middle"
                    pointerEvents="none"
                    className="fill-white/85 text-[15px] font-semibold"
                    style={{ paintOrder: "stroke", stroke: "rgba(2,6,23,0.65)", strokeWidth: 4 }}
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover card, anchored to the region's centroid */}
          {hoveredRegion ? (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-950/95 px-3 py-2 text-xs shadow-xl ring-1 ring-white/15"
              style={{ left: hoveredRegion.labelX + "%", top: hoveredRegion.labelY + "%" }}
            >
              <p className="font-semibold text-white">{hoveredRegion.name}</p>
              <p className="mt-0.5 text-slate-300">{periodAt(hoveredRegion, year).name}</p>
            </div>
          ) : null}

          <p className="border-t border-white/10 px-4 py-2 text-[11px] text-slate-400">
            Stylised regions, not accurate coastlines or borders — positions are relative only.
          </p>
        </div>

        {/* ---------------------------- Side panel -------------------------- */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {era.title}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-white tabular-nums">
              {formatYear(year)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{era.narrative}</p>
          </div>

          <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Users className="h-3.5 w-3.5" aria-hidden />
              World population
            </h3>
            <p className="mt-1 text-lg font-bold text-white tabular-nums">
              ~{population < 1000 ? Math.round(population) + " million" : (population / 1000).toFixed(1) + " billion"}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500 motion-reduce:transition-none"
                style={{ width: Math.min(100, (population / 8200) * 100) + "%" }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">{density}</p>
          </div>

          <div className="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Milestones so far
            </h3>
            <ul aria-live="polite" className="mt-2 space-y-2">
              {recentMilestones.length === 0 ? (
                <li className="text-sm text-slate-500">Nothing recorded yet at this date.</li>
              ) : (
                recentMilestones.map((m) => (
                  <li key={m.year + m.text} className="flex gap-2 text-sm">
                    <span className="shrink-0 font-mono text-xs text-amber-400 tabular-nums">
                      {formatYear(m.year).replace(" CE", "")}
                    </span>
                    <span className="text-slate-300">{m.text}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>
      </div>

      {/* ------------------------------ Controls ---------------------------- */}
      <div className="mt-5 rounded-xl bg-slate-900 p-4 ring-1 ring-white/10">
        <label htmlFor="year-slider" className="sr-only">
          Year
        </label>
        <input
          id="year-slider"
          type="range"
          min={START_YEAR}
          max={END_YEAR}
          step={STEP}
          value={year}
          onChange={(e) => {
            setPlaying(false);
            setYear(Number(e.target.value));
          }}
          aria-valuetext={formatYear(year)}
          className="w-full accent-amber-400"
        />

        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>3000 BCE</span>
          <span>1 CE</span>
          <span>2025 CE</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => { setPlaying(false); setYear(START_YEAR); }}
            aria-label="Back to the beginning"
            className="rounded-lg bg-slate-800 p-2.5 text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <SkipBack className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => nudge(-200)}
            aria-label="Rewind 200 years"
            className="rounded-lg bg-slate-800 p-2.5 text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <Rewind className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => nudge(200)}
            aria-label="Forward 200 years"
            className="rounded-lg bg-slate-800 p-2.5 text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <FastForward className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
            aria-label={"Playback speed: " + speed + " times. Change speed."}
            className="rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-bold text-slate-200 tabular-nums transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            {speed}×
          </button>
        </div>
      </div>

      {/* ------------------------------- Modal ------------------------------ */}
      <dialog
        ref={dialogRef}
        onCancel={(e) => { e.preventDefault(); closeModal(); }}
        onClose={() => { setOpenRegion(null); document.body.style.overflow = ""; }}
        className="w-full max-w-2xl rounded-2xl border-0 bg-slate-900 p-0 text-slate-100 backdrop:bg-slate-950/80"
        aria-labelledby="region-modal-title"
      >
        {openRegion ? (
          (() => {
            const period = periodAt(openRegion, year);
            return (
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {openRegion.name} · {formatYear(year)}
                    </p>
                    <h3
                      id="region-modal-title"
                      className="mt-1 font-display text-xl font-semibold text-white"
                      style={{ color: period.color }}
                    >
                      {period.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close"
                    className="rounded-lg bg-slate-800 p-2 text-slate-300 transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-300">{period.blurb}</p>

                <dl className="mt-5 space-y-3">
                  {[
                    { icon: Landmark, label: "Architecture", value: period.arch },
                    { icon: ScrollText, label: "Culture", value: period.culture },
                    { icon: Route, label: "Trade", value: period.trade },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-lg bg-slate-800/60 p-3 ring-1 ring-white/5">
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-slate-200">{value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-4 text-xs text-slate-500">
                  Dates are conventional and approximate — empires faded rather than ending on a
                  particular day, and historians disagree about many boundaries.
                </p>
              </div>
            );
          })()
        ) : null}
      </dialog>
    </div>
  );
}
