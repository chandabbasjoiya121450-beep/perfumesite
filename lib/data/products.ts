/**
 * ============================================================
 * VELORÉ — Centralized Product Data Model & Seed Catalog
 * ============================================================
 * Strongly typed single source of truth for all perfume products,
 * collections, and catalog query utilities.
 * ============================================================
 */

export type FragranceFamily = "woody" | "floral" | "fresh" | "amber-oriental";
export type FragranceFamilyDisplay = "Woody" | "Floral" | "Fresh" | "Amber & Oriental";
export type FragranceIntensity = "Subtle" | "Moderate" | "Intense" | "Extrait Intense";

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  originalPrice?: number; // Backwards-compatible alias for compareAtPrice
  currency: string;
  sizeMl: number;
  size: string; // Backwards-compatible display size (e.g. "100ml Extrait")
  images: string[];
  image: string; // Backwards-compatible primary image
  imageAlt: string;
  fragranceFamily: FragranceFamily;
  family: FragranceFamilyDisplay; // Backwards-compatible display family
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  intensity?: FragranceIntensity;
  longevity?: string;
  seasonTags: string[];
  occasionTags: string[];
  collectionIds: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isBestSeller?: boolean; // Backwards-compatible alias for isBestseller
  isGift?: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  sku?: string;
  stock?: number;
  lowStockThreshold?: number;
  status?: "published" | "draft" | "archived";
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  heroImage?: string;
  imageAlt?: string;
  image: string; // Backwards-compatible image reference
  productIds?: string[];
  sortOrder?: number;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  relatedCollectionSlugs?: string[];
}

/**
 * ============================================================
 * Central Seed Catalog: 21 Distinct Luxury Compositions
 * ============================================================
 */
export const PRODUCTS: Product[] = [
  {
    id: "velore-noir-01",
    slug: "noir",
    name: "NOIR",
    subtitle: "Dark Woods, Black Pepper & Smoldering Incense",
    description: "An enigmatic evening extrait juxtaposing sharp cracked black pepper and bitter cacao against a majestic foundation of charred oak, dark patchouli, and somber Omani frankincense.",
    price: 310,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-noir.jpg"],
    image: "/images/products/product-noir.jpg",
    imageAlt: "VELORÉ NOIR luxury perfume flacon",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["Cracked Black Pepper", "Elemi Resin", "Bitter Cacao"],
    heartNotes: ["Smoky Frankincense", "Nutmeg", "Black Plum"],
    baseNotes: ["Charred Oakwood", "Dark Patchouli", "Black Amber"],
    notes: {
      top: ["Cracked Black Pepper", "Elemi Resin", "Bitter Cacao"],
      heart: ["Smoky Frankincense", "Nutmeg", "Black Plum"],
      base: ["Charred Oakwood", "Dark Patchouli", "Black Amber"],
    },
    intensity: "Intense",
    longevity: "12+ hours",
    seasonTags: ["Autumn", "Winter"],
    occasionTags: ["Evening & Occasion", "Formal Gala"],
    collectionIds: ["best-sellers", "woody", "evening-occasion"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isAvailable: true,
    createdAt: "2026-08-10T00:00:00Z",
    seoTitle: "NOIR Extrait de Parfum — VELORÉ",
    seoDescription: "Discover NOIR by VELORÉ. An enigmatic composition of dark woods, black pepper, and smoldering incense.",
  },
  {
    id: "velore-elite-02",
    slug: "elite",
    name: "ÉLITE",
    subtitle: "Aromatic French Lavender, Clary Sage & Vetiver",
    description: "The epitome of sartorial refinement. Wild French high-altitude lavender married with aromatic clary sage, silver birch, and crisp Haitian vetiver, finished with warm roasted tonka bean.",
    price: 295,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-elite.jpg"],
    image: "/images/products/product-elite.jpg",
    imageAlt: "VELORÉ ÉLITE luxury perfume bottle",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["High-Altitude Lavender", "Clary Sage", "Pink Pepper"],
    heartNotes: ["Silver Birch", "Geranium Bourbon", "Cardamom"],
    baseNotes: ["Haitian Vetiver", "Roasted Tonka", "White Cedar"],
    notes: {
      top: ["High-Altitude Lavender", "Clary Sage", "Pink Pepper"],
      heart: ["Silver Birch", "Geranium Bourbon", "Cardamom"],
      base: ["Haitian Vetiver", "Roasted Tonka", "White Cedar"],
    },
    intensity: "Moderate",
    longevity: "8–10 hours",
    seasonTags: ["Spring", "Autumn", "All Seasons"],
    occasionTags: ["Everyday Signature", "Executive & Business"],
    collectionIds: ["new-arrivals", "woody", "everyday-signature", "gifts"],
    isFeatured: true,
    isNewArrival: true,
    isGift: true,
    isAvailable: true,
    createdAt: "2026-09-01T00:00:00Z",
    seoTitle: "ÉLITE Eau de Parfum — VELORÉ",
    seoDescription: "ÉLITE by VELORÉ: Sophisticated French lavender, clary sage, and crisp vetiver.",
  },
  {
    id: "velore-lumiere-03",
    slug: "lumiere",
    name: "LUMIÈRE",
    subtitle: "Sparkling Calabrian Bergamot & Sheer White Florals",
    description: "Sunlit optimism bottled at the Golden Hour. Crystalline Calabrian citrus and bitter orange blossom illuminate a transparent heart of royal jasmine, solar freesia, and velvety white cedar.",
    price: 265,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-lumiere.jpg"],
    image: "/images/products/product-lumiere.jpg",
    imageAlt: "VELORÉ LUMIÈRE citrus and floral fragrance",
    fragranceFamily: "fresh",
    family: "Fresh",
    topNotes: ["Calabrian Bergamot", "Mandarin Zest", "Bitter Orange"],
    heartNotes: ["Orange Blossom", "Solar Freesia", "Royal Jasmine"],
    baseNotes: ["White Cedar", "Sunlit Ambergris", "Clean Musks"],
    notes: {
      top: ["Calabrian Bergamot", "Mandarin Zest", "Bitter Orange"],
      heart: ["Orange Blossom", "Solar Freesia", "Royal Jasmine"],
      base: ["White Cedar", "Sunlit Ambergris", "Clean Musks"],
    },
    intensity: "Moderate",
    longevity: "7–9 hours",
    seasonTags: ["Spring", "Summer"],
    occasionTags: ["Everyday Signature", "Daytime Elegance"],
    collectionIds: ["fresh", "everyday-signature"],
    isFeatured: false,
    isAvailable: true,
    createdAt: "2026-07-15T00:00:00Z",
    seoTitle: "LUMIÈRE Eau de Parfum — VELORÉ",
    seoDescription: "LUMIÈRE by VELORÉ: Luminous Calabrian citrus and sheer white floral notes.",
  },
  {
    id: "velore-oud-01",
    slug: "oud-royale-01",
    name: "OUD 01",
    subtitle: "Smoky Cambodi Oud, Damascena Rose & Birch Tar",
    description: "Our signature opus. An opulent union of 25-year aged Cambodian agarwood, velvety Bulgarian damascena rose absolute, and smoky birch tar wrapped in golden amber and precious saffron.",
    price: 340,
    compareAtPrice: 380,
    originalPrice: 380,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-oud01.jpg"],
    image: "/images/products/product-oud01.jpg",
    imageAlt: "VELORÉ OUD 01 Extrait de Parfum flacon",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["Kashmiri Saffron", "Calabrian Bergamot", "Nutmeg"],
    heartNotes: ["Bulgarian Damascena Rose", "Smoky Birch", "Frankincense"],
    baseNotes: ["Cambodi Agarwood", "Golden Ambergris", "Atlas Cedar"],
    notes: {
      top: ["Kashmiri Saffron", "Calabrian Bergamot", "Nutmeg"],
      heart: ["Bulgarian Damascena Rose", "Smoky Birch", "Frankincense"],
      base: ["Cambodi Agarwood", "Golden Ambergris", "Atlas Cedar"],
    },
    intensity: "Extrait Intense",
    longevity: "14+ hours",
    seasonTags: ["Autumn", "Winter"],
    occasionTags: ["Evening & Occasion", "Grand Formalities"],
    collectionIds: ["best-sellers", "woody", "evening-occasion"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isAvailable: true,
    createdAt: "2026-06-01T00:00:00Z",
    seoTitle: "OUD 01 Extrait de Parfum — VELORÉ",
    seoDescription: "The iconic OUD 01 by VELORÉ. 25-year aged Cambodi agarwood and Bulgarian damascena rose.",
  },
  {
    id: "velore-velvet-rose-05",
    slug: "velvet-rose",
    name: "VELVET ROSE",
    subtitle: "Turkish Rose Absolute, Warm Praline & Clove",
    description: "A decadent floral confection. Rich Turkish rose petals steeped in spiced clove, roasted caramelized praline, and warm golden ambergris for an irresistible, lingering embrace.",
    price: 280,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-velvet-rose.jpg"],
    image: "/images/products/product-velvet-rose.jpg",
    imageAlt: "VELORÉ VELVET ROSE perfume bottle",
    fragranceFamily: "floral",
    family: "Floral",
    topNotes: ["Clove Bud", "Pink Pepper", "Red Berries"],
    heartNotes: ["Turkish Rose Absolute", "Damask Rosewater", "Orris"],
    baseNotes: ["Roasted Praline", "Bourbon Amber", "Patchouli"],
    notes: {
      top: ["Clove Bud", "Pink Pepper", "Red Berries"],
      heart: ["Turkish Rose Absolute", "Damask Rosewater", "Orris"],
      base: ["Roasted Praline", "Bourbon Amber", "Patchouli"],
    },
    intensity: "Moderate",
    longevity: "9–11 hours",
    seasonTags: ["Autumn", "Winter", "Spring"],
    occasionTags: ["Evening & Occasion", "Romantic Rendezvous"],
    collectionIds: ["floral", "evening-occasion", "gifts"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isGift: true,
    isAvailable: true,
    createdAt: "2026-08-20T00:00:00Z",
    seoTitle: "VELVET ROSE Eau de Parfum — VELORÉ",
    seoDescription: "VELVET ROSE by VELORÉ: Intoxicating Turkish rose absolute, warm praline, and spiced amber.",
  },
  {
    id: "velore-santal-06",
    slug: "santal",
    name: "SANTAL",
    subtitle: "Creamy Mysore Sandalwood, Cardamom & Violet Leaf",
    description: "A temple of calm and contemplation. Ethically harvested Mysore sandalwood, green crushed cardamom pods, and tender violet leaves wrapped in dry Australian papyrus.",
    price: 290,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-santal.jpg"],
    image: "/images/products/product-santal.jpg",
    imageAlt: "VELORÉ SANTAL sandalwood fragrance bottle",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["Green Cardamom", "Violet Leaf", "Coriander"],
    heartNotes: ["Tuscan Iris", "Papyrus", "Cedarwood"],
    baseNotes: ["Mysore Sandalwood", "Cashmeran", "White Amber"],
    notes: {
      top: ["Green Cardamom", "Violet Leaf", "Coriander"],
      heart: ["Tuscan Iris", "Papyrus", "Cedarwood"],
      base: ["Mysore Sandalwood", "Cashmeran", "White Amber"],
    },
    intensity: "Moderate",
    longevity: "10–12 hours",
    seasonTags: ["All Seasons"],
    occasionTags: ["Everyday Signature", "Quiet Sophistication"],
    collectionIds: ["best-sellers", "woody", "everyday-signature"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isAvailable: true,
    createdAt: "2026-06-15T00:00:00Z",
    seoTitle: "SANTAL Eau de Parfum — VELORÉ",
    seoDescription: "SANTAL by VELORÉ: Creamy Mysore sandalwood, aromatic cardamom, and violet leaf.",
  },
  {
    id: "velore-aura-07",
    slug: "aura",
    name: "AURA",
    subtitle: "Airy Solar Musks, Sparkling Aldehydes & White Tea",
    description: "Pure radiance and ethereal lightness. Clean, crystalline aldehydes rise like morning mist over delicate white peony, Chinese white tea, and translucent, skin-soft solar musks.",
    price: 255,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-aura.jpg"],
    image: "/images/products/product-aura.jpg",
    imageAlt: "VELORÉ AURA clean and airy fragrance bottle",
    fragranceFamily: "fresh",
    family: "Fresh",
    topNotes: ["Crisp Aldehydes", "Italian Lemon", "White Freesia"],
    heartNotes: ["White Peony", "White Tea Leaf", "Lily of the Valley"],
    baseNotes: ["Solar Musks", "Cashmere Wood", "Clean Ambrox"],
    notes: {
      top: ["Crisp Aldehydes", "Italian Lemon", "White Freesia"],
      heart: ["White Peony", "White Tea Leaf", "Lily of the Valley"],
      base: ["Solar Musks", "Cashmere Wood", "Clean Ambrox"],
    },
    intensity: "Subtle",
    longevity: "7–8 hours",
    seasonTags: ["Spring", "Summer"],
    occasionTags: ["Everyday Signature", "Warm Days"],
    collectionIds: ["new-arrivals", "fresh", "everyday-signature"],
    isFeatured: false,
    isNewArrival: true,
    isAvailable: true,
    createdAt: "2026-09-10T00:00:00Z",
    seoTitle: "AURA Eau de Parfum — VELORÉ",
    seoDescription: "AURA by VELORÉ: An ethereal, clean fragrance of solar musks and sparkling aldehydes.",
  },
  {
    id: "velore-amber-07-08",
    slug: "amber-07",
    name: "AMBER 07",
    subtitle: "Warm Benzoin, Resinous Labdanum & Spiced Clove",
    description: "Seventh in our resinous master sequence. Rich, viscous Siamese benzoin and Spanish labdanum blended with crushed cinnamon bark, clove, and warm smoky ambergris.",
    price: 315,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-amber07.jpg"],
    image: "/images/products/product-amber07.jpg",
    imageAlt: "VELORÉ AMBER 07 warm amber extrait flacon",
    fragranceFamily: "amber-oriental",
    family: "Amber & Oriental",
    topNotes: ["Coriander Seed", "Bergamot", "Cinnamon Bark"],
    heartNotes: ["Spanish Labdanum", "Siamese Benzoin", "Clove Bud"],
    baseNotes: ["Golden Ambergris", "Bourbon Vanilla", "Cedar"],
    notes: {
      top: ["Coriander Seed", "Bergamot", "Cinnamon Bark"],
      heart: ["Spanish Labdanum", "Siamese Benzoin", "Clove Bud"],
      base: ["Golden Ambergris", "Bourbon Vanilla", "Cedar"],
    },
    intensity: "Extrait Intense",
    longevity: "13+ hours",
    seasonTags: ["Autumn", "Winter"],
    occasionTags: ["Evening & Occasion", "Winter Warmth"],
    collectionIds: ["best-sellers", "amber-oriental", "evening-occasion"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isAvailable: true,
    createdAt: "2026-07-01T00:00:00Z",
    seoTitle: "AMBER 07 Extrait de Parfum — VELORÉ",
    seoDescription: "AMBER 07 by VELORÉ: Opulent golden amber, Siamese benzoin, and warm spice.",
  },
  {
    id: "velore-bois-blanc-09",
    slug: "bois-blanc",
    name: "BOIS BLANC",
    subtitle: "White Cedar, Haitian Vetiver & Dry Birchwood",
    description: "An architectural exploration of dry woods. Virginian white cedarwood and smokeless birch paired with mineral vetiver root, yielding a crisp, contemporary minimalist sillage.",
    price: 270,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-bois-blanc.jpg"],
    image: "/images/products/product-bois-blanc.jpg",
    imageAlt: "VELORÉ BOIS BLANC white woods fragrance",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["Angelica Root", "Juniper Berry", "Grapefruit Peel"],
    heartNotes: ["White Cedar", "Orris Root", "Pine Needles"],
    baseNotes: ["Haitian Vetiver", "Dry Birchwood", "Mineral Amber"],
    notes: {
      top: ["Angelica Root", "Juniper Berry", "Grapefruit Peel"],
      heart: ["White Cedar", "Orris Root", "Pine Needles"],
      base: ["Haitian Vetiver", "Dry Birchwood", "Mineral Amber"],
    },
    intensity: "Moderate",
    longevity: "8–10 hours",
    seasonTags: ["All Seasons"],
    occasionTags: ["Everyday Signature", "Creative Focus"],
    collectionIds: ["woody", "everyday-signature"],
    isFeatured: false,
    isAvailable: true,
    createdAt: "2026-08-05T00:00:00Z",
    seoTitle: "BOIS BLANC Eau de Parfum — VELORÉ",
    seoDescription: "BOIS BLANC by VELORÉ: Minimalist white cedar, Haitian vetiver, and dry birchwood.",
  },
  {
    id: "velore-verite-10",
    slug: "verite",
    name: "VÉRITÉ",
    subtitle: "Florentine Orris, Green Galbanum & Frankincense",
    description: "Truth in raw formulation. Rare three-year-cured Florentine orris root butter paired with bitter Persian galbanum, fresh cardamom, and church incense, creating a noble powdered green trail.",
    price: 330,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-verite.jpg"],
    image: "/images/products/product-verite.jpg",
    imageAlt: "VELORÉ VÉRITÉ pure orris extrait flacon",
    fragranceFamily: "floral",
    family: "Floral",
    topNotes: ["Persian Galbanum", "Green Cardamom", "Bergamot"],
    heartNotes: ["Florentine Orris Butter", "Narcissus", "Violet"],
    baseNotes: ["Omani Frankincense", "White Suede", "Cedar"],
    notes: {
      top: ["Persian Galbanum", "Green Cardamom", "Bergamot"],
      heart: ["Florentine Orris Butter", "Narcissus", "Violet"],
      base: ["Omani Frankincense", "White Suede", "Cedar"],
    },
    intensity: "Intense",
    longevity: "11+ hours",
    seasonTags: ["Spring", "Autumn"],
    occasionTags: ["Everyday Signature", "Art & Gallery"],
    collectionIds: ["floral", "everyday-signature"],
    isFeatured: false,
    isAvailable: true,
    createdAt: "2026-07-28T00:00:00Z",
    seoTitle: "VÉRITÉ Extrait de Parfum — VELORÉ",
    seoDescription: "VÉRITÉ by VELORÉ: Masterful Florentine orris butter, green galbanum, and incense.",
  },
  {
    id: "velore-eclat-11",
    slug: "eclat-de-bergamote",
    name: "ÉCLAT",
    subtitle: "Calabrian Bergamot, Neroli Petals & Clean Amber",
    description: "The essence of Mediterranean light. Cold-pressed winter bergamot from Reggio Calabria blended with intoxicating Tunisian neroli petals, orange blossom, and sheer crystalline amber.",
    price: 245,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-eclat.jpg"],
    image: "/images/products/product-eclat.jpg",
    imageAlt: "VELORÉ ÉCLAT citrus fragrance bottle",
    fragranceFamily: "fresh",
    family: "Fresh",
    topNotes: ["Calabrian Bergamot", "Petitgrain", "Bitter Orange"],
    heartNotes: ["Tunisian Neroli", "Orange Blossom", "White Tea"],
    baseNotes: ["Clean Amber", "Crystalline Musk", "Driftwood"],
    notes: {
      top: ["Calabrian Bergamot", "Petitgrain", "Bitter Orange"],
      heart: ["Tunisian Neroli", "Orange Blossom", "White Tea"],
      base: ["Clean Amber", "Crystalline Musk", "Driftwood"],
    },
    intensity: "Moderate",
    longevity: "7–8 hours",
    seasonTags: ["Spring", "Summer"],
    occasionTags: ["Everyday Signature", "Daytime Leisure"],
    collectionIds: ["new-arrivals", "fresh", "everyday-signature"],
    isFeatured: true,
    isNewArrival: true,
    isAvailable: true,
    createdAt: "2026-09-18T00:00:00Z",
    seoTitle: "ÉCLAT Eau de Parfum — VELORÉ",
    seoDescription: "ÉCLAT by VELORÉ: Sparkling Calabrian bergamot and radiant Tunisian neroli petals.",
  },
  {
    id: "velore-nuit-12",
    slug: "nuit",
    name: "NUIT",
    subtitle: "Night-Blooming Jasmine, Incense & Dark Patchouli",
    description: "An intoxicating midnight spell. Nocturnal jasmine sambac harvested under moonlight, blended with dark Sumatran patchouli, smoldering myrrh resin, and black velvet amber.",
    price: 320,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-nuit.jpg"],
    image: "/images/products/product-nuit.jpg",
    imageAlt: "VELORÉ NUIT night jasmine fragrance flacon",
    fragranceFamily: "amber-oriental",
    family: "Amber & Oriental",
    topNotes: ["Black Currant", "Italian Bergamot", "Nutmeg"],
    heartNotes: ["Night-Blooming Jasmine", "Red Rose", "Myrrh"],
    baseNotes: ["Dark Patchouli", "Black Amber", "Benzoin"],
    notes: {
      top: ["Black Currant", "Italian Bergamot", "Nutmeg"],
      heart: ["Night-Blooming Jasmine", "Red Rose", "Myrrh"],
      base: ["Dark Patchouli", "Black Amber", "Benzoin"],
    },
    intensity: "Intense",
    longevity: "12+ hours",
    seasonTags: ["Autumn", "Winter"],
    occasionTags: ["Evening & Occasion", "Midnight Intimacy"],
    collectionIds: ["amber-oriental", "evening-occasion"],
    isFeatured: false,
    isAvailable: true,
    createdAt: "2026-08-12T00:00:00Z",
    seoTitle: "NUIT Extrait de Parfum — VELORÉ",
    seoDescription: "NUIT by VELORÉ: Seductive night-blooming jasmine, incense, and dark patchouli.",
  },
  {
    id: "velore-musc-blanc-13",
    slug: "musc-blanc",
    name: "MUSC BLANC",
    subtitle: "Cotton Blossom, Heliotrope & Second-Skin Musks",
    description: "The luxury of understated elegance. A skin-scent veil of sun-dried Egyptian cotton flower, powdery heliotrope, and gentle macrocyclic white musks that linger intimately on the collarbone.",
    price: 250,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-musc-blanc.jpg"],
    image: "/images/products/product-musc-blanc.jpg",
    imageAlt: "VELORÉ MUSC BLANC clean skin musk flacon",
    fragranceFamily: "fresh",
    family: "Fresh",
    topNotes: ["White Freesia", "Crisp Aldehydes", "Cotton Flower"],
    heartNotes: ["Heliotrope", "White Peony", "Lilly of the Valley"],
    baseNotes: ["Solar Musks", "Sandalwood", "Skin Accord"],
    notes: {
      top: ["White Freesia", "Crisp Aldehydes", "Cotton Flower"],
      heart: ["Heliotrope", "White Peony", "Lilly of the Valley"],
      base: ["Solar Musks", "Sandalwood", "Skin Accord"],
    },
    intensity: "Subtle",
    longevity: "8–10 hours",
    seasonTags: ["All Seasons"],
    occasionTags: ["Everyday Signature", "Intimate Moments"],
    collectionIds: ["new-arrivals", "fresh", "everyday-signature"],
    isFeatured: true,
    isNewArrival: true,
    isAvailable: true,
    createdAt: "2026-09-22T00:00:00Z",
    seoTitle: "MUSC BLANC Eau de Parfum — VELORÉ",
    seoDescription: "MUSC BLANC by VELORÉ: Pure cotton blossom, heliotrope, and second-skin musks.",
  },
  {
    id: "velore-oud-royale-14",
    slug: "oud-royale",
    name: "OUD ROYALE",
    subtitle: "Aged Agarwood, Kashmiri Saffron & Golden Ambergris",
    description: "The crown jewel of our vault. Hand-selected wild agarwood aged for three decades, enveloped in rare Kashmiri red saffron threads, rich Taif rose, and natural maritime ambergris.",
    price: 385,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-oud-royale.jpg"],
    image: "/images/products/product-oud-royale.jpg",
    imageAlt: "VELORÉ OUD ROYALE vintage agarwood flacon",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["Kashmiri Saffron", "Cardamom", "Bergamot"],
    heartNotes: ["Taif Rose", "Smoky Birch", "Incense Tears"],
    baseNotes: ["Wild Agarwood 30Y", "Golden Ambergris", "Sandalwood"],
    notes: {
      top: ["Kashmiri Saffron", "Cardamom", "Bergamot"],
      heart: ["Taif Rose", "Smoky Birch", "Incense Tears"],
      base: ["Wild Agarwood 30Y", "Golden Ambergris", "Sandalwood"],
    },
    intensity: "Extrait Intense",
    longevity: "16+ hours",
    seasonTags: ["Autumn", "Winter"],
    occasionTags: ["Evening & Occasion", "Grand Formalities"],
    collectionIds: ["best-sellers", "woody", "evening-occasion"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isAvailable: true,
    createdAt: "2026-05-15T00:00:00Z",
    seoTitle: "OUD ROYALE Extrait de Parfum — VELORÉ",
    seoDescription: "OUD ROYALE by VELORÉ: 30-year wild agarwood, Kashmiri saffron, and maritime ambergris.",
  },
  {
    id: "velore-rose-absolue-15",
    slug: "rose-absolue",
    name: "ROSE ABSOLUE",
    subtitle: "Grasse Centifolia, Madagascar Pink Pepper & Patchouli",
    description: "An ode to May harvest in Grasse. Thousands of hand-picked centifolia rose petals crushed at sunrise, spiced with sparkling Madagascar pink pepper, and anchored by clean patchouli blanc.",
    price: 275,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-rose-absolue.jpg"],
    image: "/images/products/product-rose-absolue.jpg",
    imageAlt: "VELORÉ ROSE ABSOLUE May rose perfume",
    fragranceFamily: "floral",
    family: "Floral",
    topNotes: ["Madagascar Pink Pepper", "Mandarin Zest", "Bergamot"],
    heartNotes: ["Grasse Centifolia Rose", "Turkish Rose Absolute"],
    baseNotes: ["Patchouli Blanc", "Ambrette Seed", "White Musks"],
    notes: {
      top: ["Madagascar Pink Pepper", "Mandarin Zest", "Bergamot"],
      heart: ["Grasse Centifolia Rose", "Turkish Rose Absolute"],
      base: ["Patchouli Blanc", "Ambrette Seed", "White Musks"],
    },
    intensity: "Moderate",
    longevity: "9–10 hours",
    seasonTags: ["Spring", "Summer", "All Seasons"],
    occasionTags: ["Everyday Signature", "Daytime Elegance"],
    collectionIds: ["best-sellers", "floral", "everyday-signature"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isAvailable: true,
    createdAt: "2026-06-25T00:00:00Z",
    seoTitle: "ROSE ABSOLUE Eau de Parfum — VELORÉ",
    seoDescription: "ROSE ABSOLUE by VELORÉ: Grasse centifolia rose, pink pepper, and clean patchouli blanc.",
  },
  {
    id: "velore-cedre-elite-16",
    slug: "cedre-elite",
    name: "CÈDRE ÉLITE",
    subtitle: "Wild Himalayan Cedar, Juniper & Clary Sage",
    description: "High mountain air and ancient coniferous forests. Noble Himalayan cedarwood resin blended with crisp gin-like juniper berries, herbal clary sage, and damp earthy moss.",
    price: 260,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Eau de Parfum",
    images: ["/images/products/product-cedre.jpg"],
    image: "/images/products/product-cedre.jpg",
    imageAlt: "VELORÉ CÈDRE ÉLITE cedarwood fragrance bottle",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["Juniper Berries", "Clary Sage", "Pink Grapefruit"],
    heartNotes: ["Himalayan Cedar", "Cypress Needles", "Pine Cone"],
    baseNotes: ["Haitian Vetiver", "Oakmoss", "White Cedar"],
    notes: {
      top: ["Juniper Berries", "Clary Sage", "Pink Grapefruit"],
      heart: ["Himalayan Cedar", "Cypress Needles", "Pine Cone"],
      base: ["Haitian Vetiver", "Oakmoss", "White Cedar"],
    },
    intensity: "Moderate",
    longevity: "8–10 hours",
    seasonTags: ["Autumn", "Winter", "Spring"],
    occasionTags: ["Everyday Signature", "Outdoor Crispness"],
    collectionIds: ["new-arrivals", "woody", "everyday-signature"],
    isFeatured: true,
    isNewArrival: true,
    isAvailable: true,
    createdAt: "2026-09-14T00:00:00Z",
    seoTitle: "CÈDRE ÉLITE Eau de Parfum — VELORÉ",
    seoDescription: "CÈDRE ÉLITE by VELORÉ: Himalayan cedarwood, aromatic juniper, and clary sage.",
  },
  {
    id: "velore-iris-noir-17",
    slug: "iris-noir",
    name: "IRIS NOIR",
    subtitle: "Florentine Orris, Polished Leather & Night Jasmine",
    description: "An aristocratic nocturnal composition. The buttery richness of aged Florentine orris root juxtaposed against soft glover's leather, midnight jasmine, and dark tonka bean.",
    price: 325,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-iris-noir.jpg"],
    image: "/images/products/product-iris-noir.jpg",
    imageAlt: "VELORÉ IRIS NOIR orris and leather extrait flacon",
    fragranceFamily: "floral",
    family: "Floral",
    topNotes: ["Italian Bergamot", "Angelica Seed", "Pink Pepper"],
    heartNotes: ["Florentine Orris", "Night Jasmine", "Osmanthus"],
    baseNotes: ["Cuir Noir (Leather)", "Siam Benzoin", "Smoky Cedar"],
    notes: {
      top: ["Italian Bergamot", "Angelica Seed", "Pink Pepper"],
      heart: ["Florentine Orris", "Night Jasmine", "Osmanthus"],
      base: ["Cuir Noir (Leather)", "Siam Benzoin", "Smoky Cedar"],
    },
    intensity: "Intense",
    longevity: "12+ hours",
    seasonTags: ["Autumn", "Winter"],
    occasionTags: ["Evening & Occasion", "Formal Soirée"],
    collectionIds: ["new-arrivals", "floral", "evening-occasion"],
    isFeatured: true,
    isNewArrival: true,
    isAvailable: true,
    createdAt: "2026-09-08T00:00:00Z",
    seoTitle: "IRIS NOIR Extrait de Parfum — VELORÉ",
    seoDescription: "IRIS NOIR by VELORÉ: Florentine orris root, midnight jasmine, and supple leather.",
  },
  {
    id: "velore-ambre-nuit-18",
    slug: "ambre-nuit",
    name: "AMBRE NUIT",
    subtitle: "Golden Labdanum, Bourbon Vanilla & Benzoin",
    description: "Warmth captured in liquid amber. Sun-baked Mediterranean labdanum resin infused with spicy cinnamon bark, Madagascan bourbon vanilla beans, and roasted benzoin.",
    price: 310,
    compareAtPrice: 345,
    originalPrice: 345,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-ambre.jpg"],
    image: "/images/products/product-ambre.jpg",
    imageAlt: "VELORÉ AMBRE NUIT amber vanilla extrait flacon",
    fragranceFamily: "amber-oriental",
    family: "Amber & Oriental",
    topNotes: ["Coriander Seed", "Calabrian Bergamot", "Cinnamon Bark"],
    heartNotes: ["Golden Labdanum", "Smoky Benzoin", "Orris Butter"],
    baseNotes: ["Bourbon Vanilla", "Tonka Bean", "Golden Amber"],
    notes: {
      top: ["Coriander Seed", "Calabrian Bergamot", "Cinnamon Bark"],
      heart: ["Golden Labdanum", "Smoky Benzoin", "Orris Butter"],
      base: ["Bourbon Vanilla", "Tonka Bean", "Golden Amber"],
    },
    intensity: "Intense",
    longevity: "13+ hours",
    seasonTags: ["Autumn", "Winter"],
    occasionTags: ["Evening & Occasion", "Fireside Intimacy"],
    collectionIds: ["best-sellers", "amber-oriental", "evening-occasion"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isAvailable: true,
    createdAt: "2026-06-20T00:00:00Z",
    seoTitle: "AMBRE NUIT Extrait de Parfum — VELORÉ",
    seoDescription: "AMBRE NUIT by VELORÉ: Resinous Spanish labdanum, cinnamon, and bourbon vanilla.",
  },
  {
    id: "velore-maison-signature-19",
    slug: "maison-signature",
    name: "MAISON SIGNATURE",
    subtitle: "Elemi Resin, Vintage Benzoin & Smoked Cedar",
    description: "The founding scent of our Paris atelier. Balsamic elemi gum from the Philippines, aged Siam benzoin, and smoked cedarwood, unified by a whisper of dry incense and golden musks.",
    price: 350,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-elan-signature.jpg"],
    image: "/images/products/product-elan-signature.jpg",
    imageAlt: "VELORÉ MAISON SIGNATURE founding flacon",
    fragranceFamily: "amber-oriental",
    family: "Amber & Oriental",
    topNotes: ["Elemi Resin", "Cardamom", "Bergamot"],
    heartNotes: ["Incense Tears", "Cashmeran", "Myrrh"],
    baseNotes: ["Siam Benzoin", "Smoked Cedar", "Golden Musks"],
    notes: {
      top: ["Elemi Resin", "Cardamom", "Bergamot"],
      heart: ["Incense Tears", "Cashmeran", "Myrrh"],
      base: ["Siam Benzoin", "Smoked Cedar", "Golden Musks"],
    },
    intensity: "Extrait Intense",
    longevity: "14+ hours",
    seasonTags: ["All Seasons"],
    occasionTags: ["Everyday Signature", "Connoisseur Evenings"],
    collectionIds: ["best-sellers", "amber-oriental", "evening-occasion", "gifts"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isGift: true,
    isAvailable: true,
    createdAt: "2026-05-01T00:00:00Z",
    seoTitle: "MAISON SIGNATURE Extrait de Parfum — VELORÉ",
    seoDescription: "MAISON SIGNATURE by VELORÉ: The atelier's founding formulation of elemi and aged benzoin.",
  },
  {
    id: "velore-discovery-set-20",
    slug: "discovery-collection",
    name: "THE PRIVATE DISCOVERY COFFRET",
    subtitle: "Five 10ml Signature Fragrance Extraits",
    description: "An invitation to explore the full spectrum of VELORÉ. Includes Oud Royale 01, Santal, Rose Absolue, Ambre Nuit, and Éclat in 10ml glass flacons with a $135 voucher toward your first full bottle.",
    price: 135,
    currency: "USD",
    sizeMl: 50,
    size: "5 × 10ml Coffret",
    images: ["/images/products/product-discovery-set.jpg"],
    image: "/images/products/product-discovery-set.jpg",
    imageAlt: "VELORÉ Private Discovery Coffret gift set",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["5 Scent Profiles: Woody, Floral, Fresh, Amber"],
    heartNotes: ["Handmade Velvet Gift Box"],
    baseNotes: ["Includes $135 Full Bottle Voucher"],
    notes: {
      top: ["5 Scent Profiles: Woody, Floral, Fresh, Amber"],
      heart: ["Handmade Velvet Gift Box"],
      base: ["Includes $135 Full Bottle Voucher"],
    },
    intensity: "Moderate",
    longevity: "Varies by extrait",
    seasonTags: ["All Seasons"],
    occasionTags: ["Gifting", "Travel & Discovery"],
    collectionIds: ["gifts", "best-sellers"],
    isFeatured: true,
    isBestseller: true,
    isBestSeller: true,
    isGift: true,
    isAvailable: true,
    createdAt: "2026-05-10T00:00:00Z",
    seoTitle: "The Private Discovery Coffret — VELORÉ",
    seoDescription: "Explore five VELORÉ signature fragrance extraits housed in an artisan gift box.",
  },
  {
    id: "velore-vintage-santal-21",
    slug: "vintage-santal",
    name: "VINTAGE SANTAL",
    subtitle: "Barrel-Aged Mysore Sandalwood & Tonka",
    description: "A reserve harvest aged in French oak barrels. Exceptionally rounded Mysore sandalwood heartwood, warm spicy cardamom, sweet hay accord, and balsamic tonka absolute.",
    price: 360,
    currency: "USD",
    sizeMl: 100,
    size: "100ml Extrait de Parfum",
    images: ["/images/products/product-maison.jpg"],
    image: "/images/products/product-maison.jpg",
    imageAlt: "VELORÉ VINTAGE SANTAL reserve flacon",
    fragranceFamily: "woody",
    family: "Woody",
    topNotes: ["Aged Cardamom", "Bergamot", "Nutmeg"],
    heartNotes: ["Mysore Sandalwood Heart", "French Oak", "Papyrus"],
    baseNotes: ["Tonka Absolute", "Cashmeran", "Dark Amber"],
    notes: {
      top: ["Aged Cardamom", "Bergamot", "Nutmeg"],
      heart: ["Mysore Sandalwood Heart", "French Oak", "Papyrus"],
      base: ["Tonka Absolute", "Cashmeran", "Dark Amber"],
    },
    intensity: "Extrait Intense",
    longevity: "14+ hours",
    seasonTags: ["Autumn", "Winter"],
    occasionTags: ["Evening & Occasion", "Collector Reserve"],
    collectionIds: ["new-arrivals", "woody", "evening-occasion"],
    isFeatured: true,
    isNewArrival: true,
    isAvailable: true,
    createdAt: "2026-09-26T00:00:00Z",
    seoTitle: "VINTAGE SANTAL Extrait de Parfum — VELORÉ",
    seoDescription: "VINTAGE SANTAL by VELORÉ: Barrel-aged Mysore sandalwood and French oak.",
  },
];

/**
 * ============================================================
 * Central Collections Data
 * ============================================================
 */
export const COLLECTIONS: Collection[] = [
  {
    id: "new-arrivals",
    slug: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Freshly Matured Harvests",
    shortDescription: "Our newest seasonal extraits and eau de parfums.",
    description: "Discover our newest seasonal releases, formulated with exceptional regional botanical distillations and pure extracts.",
    heroImage: "/images/products/collection-unisex.jpg",
    imageAlt: "VELORÉ New Arrivals Fragrance Collection",
    image: "/images/products/collection-unisex.jpg",
    sortOrder: 1,
    isFeatured: true,
    seoTitle: "New Perfume Arrivals — Luxury Fragrance | VELORÉ",
    seoDescription: "Explore new fragrance arrivals from VELORÉ Haute Parfumerie. Freshly matured extraits and eau de parfums.",
    relatedCollectionSlugs: ["best-sellers", "fresh", "everyday-signature"],
  },
  {
    id: "best-sellers",
    slug: "best-sellers",
    title: "Best Sellers",
    subtitle: "Curated Connoisseur Favorites",
    shortDescription: "Our most revered and celebrated compositions.",
    description: "Our most revered and celebrated compositions, beloved for their timeless presence, layered complexity, and distinguished sillage.",
    heroImage: "/images/products/collection-men.jpg",
    imageAlt: "VELORÉ Best Sellers Curated Fragrances",
    image: "/images/products/collection-men.jpg",
    sortOrder: 2,
    isFeatured: true,
    seoTitle: "Best Selling Fragrances — Curated Favorites | VELORÉ",
    seoDescription: "Discover VELORÉ best selling perfumes, beloved by fragrance connoisseurs around the world.",
    relatedCollectionSlugs: ["evening-occasion", "woody", "amber-oriental"],
  },
  {
    id: "woody",
    slug: "woody",
    title: "Woody Fragrances",
    subtitle: "Noble Woods & Resins",
    shortDescription: "Aged agarwood, charred oak, smoky cedar, and creamy Mysore sandalwood.",
    description: "Deep, noble resins, aged Cambodian agarwood, smoky Himalayan cedar, and creamy Mysore sandalwood sculpted into commanding signatures.",
    heroImage: "/images/products/product-bois-blanc.jpg",
    imageAlt: "VELORÉ Woody Fragrance Collection",
    image: "/images/products/product-bois-blanc.jpg",
    sortOrder: 3,
    isFeatured: true,
    seoTitle: "Woody Fragrances & Perfumes | VELORÉ",
    seoDescription: "Immerse yourself in VELORÉ woody perfumes featuring sandalwood, cedar, vetiver, and smoky agarwood.",
    relatedCollectionSlugs: ["everyday-signature", "amber-oriental", "new-arrivals"],
  },
  {
    id: "floral",
    slug: "floral",
    title: "Floral Fragrances",
    subtitle: "Precious Petals & Orris",
    shortDescription: "Centifolia rose, Florentine iris butter, and nocturnal petals.",
    description: "Intoxicating centifolia rose, Florentine iris butter, and nocturnal white petals gathered at dusk for unmatched elegance.",
    heroImage: "/images/products/product-velvet-rose.jpg",
    imageAlt: "VELORÉ Floral Fragrance Collection",
    image: "/images/products/product-velvet-rose.jpg",
    sortOrder: 4,
    isFeatured: true,
    seoTitle: "Floral Perfumes & Extraits | VELORÉ",
    seoDescription: "Discover artisanal floral perfumes from VELORÉ crafted with Grasse rose, iris, and white floral absolutes.",
    relatedCollectionSlugs: ["gifts", "fresh", "everyday-signature"],
  },
  {
    id: "fresh",
    slug: "fresh",
    title: "Fresh Fragrances",
    subtitle: "Solar Musks & Citrus",
    shortDescription: "Cold-pressed Calabrian citrus, sparkling Italian neroli, and crystalline solar musks.",
    description: "Cold-pressed Calabrian citrus, sparkling Italian neroli, and crystalline solar musks crafted for uplifting, radiant distinction.",
    heroImage: "/images/products/product-eclat.jpg",
    imageAlt: "VELORÉ Fresh Fragrance Collection",
    image: "/images/products/product-eclat.jpg",
    sortOrder: 5,
    isFeatured: true,
    seoTitle: "Fresh Citrus & Aquatic Fragrances | VELORÉ",
    seoDescription: "Explore luminous fresh fragrances from VELORÉ with vibrant citrus, crisp neroli, and crystalline solar musks.",
    relatedCollectionSlugs: ["new-arrivals", "everyday-signature", "floral"],
  },
  {
    id: "amber-oriental",
    slug: "amber-oriental",
    title: "Amber & Oriental",
    subtitle: "Golden Resins & Vanilla",
    shortDescription: "Sumptuous golden labdanum, rare balsamic benzoin, and warm bourbon vanilla.",
    description: "Sumptuous golden labdanum, rare balsamic benzoin tears, and warm bourbon vanilla for an intimate, magnetic trail.",
    heroImage: "/images/products/product-amber07.jpg",
    imageAlt: "VELORÉ Amber & Oriental Fragrance Collection",
    image: "/images/products/product-amber07.jpg",
    sortOrder: 6,
    isFeatured: true,
    seoTitle: "Amber & Oriental Perfumes | VELORÉ",
    seoDescription: "Discover enveloping amber and oriental fragrances from VELORÉ with rich balsamic resins and sweet vanilla.",
    relatedCollectionSlugs: ["evening-occasion", "woody", "best-sellers"],
  },
  {
    id: "everyday-signature",
    slug: "everyday-signature",
    title: "Everyday Signature",
    subtitle: "Daily Sophistication",
    shortDescription: "Refined, versatile compositions crafted to elevate daily rituals and professional presence.",
    description: "Refined, versatile compositions crafted to seamlessly elevate daily rituals and professional presence with understated confidence.",
    heroImage: "/images/products/collection-women.jpg",
    imageAlt: "VELORÉ Everyday Signature Collection",
    image: "/images/products/collection-women.jpg",
    sortOrder: 7,
    isFeatured: true,
    seoTitle: "Everyday Signature Perfumes | VELORÉ",
    seoDescription: "Refined daily perfumes for work, leisure, and daily elegance. Find your everyday signature at VELORÉ.",
    relatedCollectionSlugs: ["woody", "fresh", "best-sellers"],
  },
  {
    id: "evening-occasion",
    slug: "evening-occasion",
    title: "Evening & Occasion",
    subtitle: "Midnight Magnetism",
    shortDescription: "Intense, captivating extraits formulated for formal gatherings, galas, and intimate soirees.",
    description: "Intense, captivating extraits formulated for memorable formal gatherings, galas, and intimate soirees that command attention.",
    heroImage: "/images/products/brand-story-sculptural.jpg",
    imageAlt: "VELORÉ Evening & Occasion Collection",
    image: "/images/products/brand-story-sculptural.jpg",
    sortOrder: 8,
    isFeatured: true,
    seoTitle: "Evening & Special Occasion Perfumes | VELORÉ",
    seoDescription: "Command the night with VELORÉ evening extraits. Deep, sensual, and unforgettable formulations for special occasions.",
    relatedCollectionSlugs: ["amber-oriental", "woody", "best-sellers"],
  },
  {
    id: "gifts",
    slug: "gifts",
    title: "Gifts & Coffrets",
    subtitle: "Curated Sets & Discovery",
    shortDescription: "Thoughtful fragrance gifts for meaningful moments and memorable occasions.",
    description: "Thoughtful fragrance gifts and curated discovery coffrets crafted for meaningful moments and connoisseur gifting.",
    heroImage: "/images/products/collection-exclusive.jpg",
    imageAlt: "VELORÉ Fragrance Gifts & Coffrets",
    image: "/images/products/collection-exclusive.jpg",
    sortOrder: 9,
    isFeatured: true,
    seoTitle: "Luxury Fragrance Gifts & Discovery Coffrets | VELORÉ",
    seoDescription: "Exquisite perfume gifts and discovery sets from VELORÉ. Perfect for discerning fragrance lovers.",
    relatedCollectionSlugs: ["best-sellers", "floral", "new-arrivals"],
  },
];

/**
 * Fragrance family metadata for visual tiles
 */
export const FRAGRANCE_FAMILIES = [
  {
    id: "woody",
    name: "Woody",
    slug: "woody",
    description: "Deep, noble resins, aged oud, smoky cedar, and creamy sandalwood.",
    image: "/images/products/product-bois-blanc.jpg",
    count: "7 Fragrances",
  },
  {
    id: "floral",
    name: "Floral",
    slug: "floral",
    description: "Intoxicating centifolia rose, Florentine iris, and nocturnal white petals.",
    image: "/images/products/product-velvet-rose.jpg",
    count: "4 Fragrances",
  },
  {
    id: "fresh",
    name: "Fresh",
    slug: "fresh",
    description: "Cold-pressed citrus, sparkling Italian neroli, and crystalline solar musks.",
    image: "/images/products/product-eclat.jpg",
    count: "5 Fragrances",
  },
  {
    id: "amber",
    name: "Amber & Oriental",
    slug: "amber-oriental",
    description: "Sumptuous golden labdanum, rare balsamic resins, and bourbon vanilla.",
    image: "/images/products/product-amber07.jpg",
    count: "5 Fragrances",
  },
];

/**
 * ============================================================
 * Centralized Catalog Query Utilities
 * ============================================================
 */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByFamily(family: FragranceFamily | FragranceFamilyDisplay): Product[] {
  const norm = family.toLowerCase().replace("& ", "");
  return PRODUCTS.filter((p) =>
    p.fragranceFamily.toLowerCase() === norm ||
    p.family.toLowerCase().replace("& ", "") === norm
  );
}

export function getProductsByCollection(collectionSlugOrId: string): Product[] {
  const collection = COLLECTIONS.find(
    (c) => c.slug === collectionSlugOrId || c.id === collectionSlugOrId
  );
  if (!collection) return [];
  if (collection.productIds && collection.productIds.length > 0) {
    return PRODUCTS.filter((p) => collection.productIds!.includes(p.id));
  }
  return PRODUCTS.filter((p) => {
    if (p.collectionIds && (p.collectionIds.includes(collection.slug) || p.collectionIds.includes(collection.id))) {
      return true;
    }
    if (collection.slug === "woody" && p.fragranceFamily === "woody") return true;
    if (collection.slug === "floral" && p.fragranceFamily === "floral") return true;
    if (collection.slug === "fresh" && p.fragranceFamily === "fresh") return true;
    if (collection.slug === "amber-oriental" && p.fragranceFamily === "amber-oriental") return true;
    if (collection.slug === "new-arrivals" && p.isNewArrival) return true;
    if (collection.slug === "best-sellers" && (p.isBestseller || p.isBestSeller)) return true;
    if (collection.slug === "gifts" && p.isGift) return true;
    return false;
  });
}

export function getRelatedCollections(collectionSlug: string, count: number = 3): Collection[] {
  const current = getCollectionBySlug(collectionSlug);
  if (!current) return COLLECTIONS.filter((c) => c.slug !== collectionSlug).slice(0, count);

  if (current.relatedCollectionSlugs && current.relatedCollectionSlugs.length > 0) {
    const related = current.relatedCollectionSlugs
      .map((slug) => getCollectionBySlug(slug))
      .filter((c): c is Collection => Boolean(c));
    if (related.length >= count) return related.slice(0, count);
    const fallbacks = COLLECTIONS.filter(
      (c) => c.slug !== collectionSlug && !current.relatedCollectionSlugs?.includes(c.slug)
    );
    return [...related, ...fallbacks].slice(0, count);
  }

  return COLLECTIONS.filter((c) => c.slug !== collectionSlug).slice(0, count);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.isNewArrival);
}

export function getBestSellers(): Product[] {
  return PRODUCTS.filter((p) => p.isBestseller || p.isBestSeller);
}

export function getGifts(): Product[] {
  return PRODUCTS.filter((p) => p.isGift || p.collectionIds.includes("gifts"));
}

export function getRelatedProducts(product: Product, count: number = 4): Product[] {
  const candidates = PRODUCTS.filter((p) => p.id !== product.id);

  const scored = candidates.map((cand) => {
    let score = 0;
    if (cand.fragranceFamily === product.fragranceFamily) score += 5;
    const sharedOccasions = cand.occasionTags?.filter((o) =>
      product.occasionTags?.includes(o)
    ).length || 0;
    score += sharedOccasions * 2;
    const sharedSeasons = cand.seasonTags?.filter((s) =>
      product.seasonTags?.includes(s)
    ).length || 0;
    score += sharedSeasons;
    const sharedCollections = cand.collectionIds?.filter((c) =>
      product.collectionIds?.includes(c)
    ).length || 0;
    score += sharedCollections * 2;
    if (cand.isFeatured) score += 1;

    return { product: cand, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((item) => item.product);
}

export function getAllCollections(): Collection[] {
  return COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug || c.id === slug);
}

/**
 * Search across name, subtitle, description, fragrance notes, and tags
 */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;

  return PRODUCTS.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.fragranceFamily.toLowerCase().includes(q) ||
      p.family.toLowerCase().includes(q) ||
      p.topNotes.some((n) => n.toLowerCase().includes(q)) ||
      p.heartNotes.some((n) => n.toLowerCase().includes(q)) ||
      p.baseNotes.some((n) => n.toLowerCase().includes(q)) ||
      p.seasonTags.some((t) => t.toLowerCase().includes(q)) ||
      p.occasionTags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function sortProducts(
  products: Product[],
  sortBy: "featured" | "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc" = "featured"
): Product[] {
  const copy = [...products];
  switch (sortBy) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "featured":
    default:
      return copy.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
}
