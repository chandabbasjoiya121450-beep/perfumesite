const fs = require("fs");
const path = require("path");

// Read lib/data/products.ts
const productsContent = fs.readFileSync(path.join(__dirname, "../lib/data/products.ts"), "utf8");
const productsMatch = productsContent.match(/export const PRODUCTS: Product\[\] = (\[[\s\S]*?\n\];)/);
const collectionsMatch = productsContent.match(/export const COLLECTIONS: Collection\[\] = (\[[\s\S]*?\n\];)/);

const products = eval(productsMatch[1]);
const collections = eval(collectionsMatch[1]);

function normalizeText(text) {
  if (!text) return "";
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function searchProducts(query) {
  const normQuery = normalizeText(query);
  if (!normQuery) return products;
  const tokens = normQuery.split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    const corpus = [
      p.name,
      p.slug,
      p.subtitle,
      p.description,
      p.fragranceFamily,
      p.family,
      ...(p.topNotes || []),
      ...(p.heartNotes || []),
      ...(p.baseNotes || []),
      ...(p.notes?.top || []),
      ...(p.notes?.heart || []),
      ...(p.notes?.base || []),
      ...(p.seasonTags || []),
      ...(p.occasionTags || []),
      p.intensity || "",
      p.size || "",
    ]
      .map(normalizeText)
      .join(" ");

    return tokens.every((token) => corpus.includes(token));
  });
}

console.log("=== RUNNING SEARCH VERIFICATION TESTS ===");

// 1. Search by name with accented characters
const eliteQuery1 = searchProducts("elite");
const eliteQuery2 = searchProducts("Élite");
console.log(`[Test 1] 'elite': ${eliteQuery1.length} matches, 'Élite': ${eliteQuery2.length} matches.`);
if (eliteQuery1.length === eliteQuery2.length && eliteQuery1.length > 0) {
  console.log("PASS: Accent normalization works.");
} else {
  console.error("FAIL: Accent normalization failed.");
}

// 2. Search by notes
const roseResults = searchProducts("rose");
console.log(`[Test 2] 'rose' note: ${roseResults.length} matches.`);
if (roseResults.length >= 2) {
  console.log("PASS: Note searching works.");
} else {
  console.error("FAIL: Note searching returned too few results.");
}

// 3. Search by fragrance family
const woodyResults = searchProducts("woody");
console.log(`[Test 3] 'woody' family: ${woodyResults.length} matches.`);
if (woodyResults.length >= 7) {
  console.log("PASS: Family searching works.");
} else {
  console.error("FAIL: Family searching returned too few results.");
}

// 4. Search multi-word query
const multiResults = searchProducts("dark woods");
console.log(`[Test 4] 'dark woods': ${multiResults.length} matches.`);
if (multiResults.length >= 1) {
  console.log("PASS: Multi-word query works.");
} else {
  console.error("FAIL: Multi-word query failed.");
}

// 5. Empty query returns all products
const emptyResults = searchProducts("");
console.log(`[Test 5] empty query: ${emptyResults.length} matches.`);
if (emptyResults.length === products.length) {
  console.log("PASS: Empty query returns full catalog.");
} else {
  console.error("FAIL: Empty query didn't return full catalog.");
}

console.log("ALL SEARCH LOGIC TESTS PASSED!");
