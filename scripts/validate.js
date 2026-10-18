const fs = require("fs");
const path = require("path");

const productsFile = path.join(__dirname, "../lib/data/products.ts");
const content = fs.readFileSync(productsFile, "utf-8");

console.log("=== VELORÉ MODULE 4 DATA INTEGRITY CHECKS ===\n");

// 1. Extract product IDs and Slugs
const idMatches = [...content.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
const slugMatches = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const priceMatches = [...content.matchAll(/price:\s*(\d+)/g)].map((m) => Number(m[1]));
const imageMatches = [...content.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]);

// Distinct product IDs (excluding collection IDs)
const productIds = idMatches.filter((id) => id.startsWith("velore-"));
console.log(`[1] Total distinct products: ${productIds.length}`);
if (productIds.length < 20) {
  console.error(`FAIL: Expected >= 20 products, found ${productIds.length}`);
  process.exit(1);
} else {
  console.log(`PASS: Found ${productIds.length} products (>= 20 target satisfied).`);
}

// 2. ID Uniqueness
const uniqueIds = new Set(productIds);
if (uniqueIds.size !== productIds.length) {
  console.error("FAIL: Duplicate product IDs detected.");
  process.exit(1);
} else {
  console.log(`PASS: All ${uniqueIds.size} product IDs are strictly unique.`);
}

// 3. Price Validation
const invalidPrices = priceMatches.filter((p) => typeof p !== "number" || p <= 0);
if (invalidPrices.length > 0) {
  console.error("FAIL: Invalid prices found.");
  process.exit(1);
} else {
  console.log(`PASS: All ${priceMatches.length} prices are valid positive numbers.`);
}

// 4. Image Resolution
let missingImages = 0;
imageMatches.forEach((img) => {
  const fullPath = path.join(__dirname, "../public", img.replace(/^\//, ""));
  if (!fs.existsSync(fullPath)) {
    console.error(`FAIL: Missing image asset on disk: ${fullPath}`);
    missingImages++;
  }
});
if (missingImages > 0) {
  process.exit(1);
} else {
  console.log(`PASS: All ${imageMatches.length} product images resolve directly to valid local assets.`);
}

console.log("\nALL MODULE 4 DATA INTEGRITY CHECKS PASSED SUCCESSFULLY!");
