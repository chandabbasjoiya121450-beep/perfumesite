const fs = require("fs");
const path = require("path");

// Read and parse products from products.ts
const productsContent = fs.readFileSync(path.join(__dirname, "../lib/data/products.ts"), "utf8");

// Extract COLLECTIONS array
const collectionsMatch = productsContent.match(/export const COLLECTIONS: Collection\[\] = (\[[\s\S]*?\n\];)/);
if (!collectionsMatch) {
  console.error("Could not find COLLECTIONS");
  process.exit(1);
}

// Extract PRODUCTS array
const productsMatch = productsContent.match(/export const PRODUCTS: Product\[\] = (\[[\s\S]*?\n\];)/);
if (!productsMatch) {
  console.error("Could not find PRODUCTS");
  process.exit(1);
}

// Evaluate safely
const products = eval(productsMatch[1]);
const collections = eval(collectionsMatch[1]);

console.log(`Found ${collections.length} collections and ${products.length} products.`);

collections.forEach((c) => {
  let count = 0;
  if (c.filterRule) {
    count = products.filter(c.filterRule).length;
  } else if (c.productIds) {
    count = products.filter((p) => c.productIds.includes(p.id)).length;
  } else {
    count = products.filter((p) => p.collectionIds.includes(c.id)).length;
  }
  console.log(`- Collection [${c.slug}] "${c.title}": ${count} products (Hero: ${c.heroImage})`);

  // Check hero image
  if (c.heroImage) {
    const assetPath = path.join(__dirname, "../public", c.heroImage);
    if (!fs.existsSync(assetPath)) {
      console.error(`  MISSING HERO IMAGE: ${assetPath}`);
    }
  }
});
