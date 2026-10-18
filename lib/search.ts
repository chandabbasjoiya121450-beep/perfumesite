import { PRODUCTS, COLLECTIONS, Product, Collection } from "@/lib/data/products";

/**
 * Normalizes text by removing diacritical marks/accents, lowercasing, and trimming.
 * E.g., "ÉLITE" -> "elite", "Lumière" -> "lumiere", "VÉRITÉ" -> "verite"
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Global search across the centralized perfume catalog.
 * Matches name, subtitle, description, fragrance family, notes (top/heart/base),
 * and occasion/season tags with accent and case normalization.
 */
export function searchProductsEnhanced(query: string): Product[] {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return PRODUCTS;

  // Split into tokens for multi-word queries (e.g. "woody cedar")
  const tokens = normQuery.split(/\s+/).filter(Boolean);

  return PRODUCTS.filter((product) => {
    // Build searchable corpus for this perfume
    const searchCorpus = [
      product.name,
      product.slug,
      product.subtitle,
      product.description,
      product.fragranceFamily,
      product.family,
      ...(product.topNotes || []),
      ...(product.heartNotes || []),
      ...(product.baseNotes || []),
      ...(product.notes?.top || []),
      ...(product.notes?.heart || []),
      ...(product.notes?.base || []),
      ...(product.seasonTags || []),
      ...(product.occasionTags || []),
      product.intensity || "",
      product.size || "",
    ]
      .map(normalizeSearchText)
      .join(" ");

    // Every token must appear in the searchable corpus
    return tokens.every((token) => searchCorpus.includes(token));
  });
}

/**
 * Search curated fragrance collections by title, subtitle, description, or slug.
 */
export function searchCollectionsEnhanced(query: string): Collection[] {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return [];

  const tokens = normQuery.split(/\s+/).filter(Boolean);

  return COLLECTIONS.filter((col) => {
    const colCorpus = [
      col.title,
      col.subtitle || "",
      col.description,
      col.shortDescription || "",
      col.slug,
    ]
      .map(normalizeSearchText)
      .join(" ");

    return tokens.every((token) => colCorpus.includes(token));
  });
}

export interface LiveSearchSuggestions {
  query: string;
  normalizedQuery: string;
  products: Product[];
  collections: Collection[];
  totalProductMatches: number;
}

/**
 * Provides live instant suggestions for the search overlay and search input.
 */
export function getLiveSearchSuggestions(
  query: string,
  limitProducts: number = 5,
  limitCollections: number = 3
): LiveSearchSuggestions {
  const norm = normalizeSearchText(query);
  if (!norm) {
    return {
      query,
      normalizedQuery: "",
      products: [],
      collections: [],
      totalProductMatches: 0,
    };
  }

  const matchingProducts = searchProductsEnhanced(query);
  const matchingCollections = searchCollectionsEnhanced(query);

  return {
    query,
    normalizedQuery: norm,
    products: matchingProducts.slice(0, limitProducts),
    collections: matchingCollections.slice(0, limitCollections),
    totalProductMatches: matchingProducts.length,
  };
}
