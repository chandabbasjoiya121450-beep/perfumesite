// Automated Verification Test Suite for Module 17: SEO, Structured Data & Sitemap
import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("============================================================");
  console.log("VELORÉ — MODULE 17: SEO, STRUCTURED DATA & SITEMAP VERIFICATION");
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ [PASS] Scenario ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] Scenario ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Robots.txt
  await test("1: Robots.txt serves valid rules and sitemap link", async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    assert.strictEqual(res.status, 200, "robots.txt must return 200 OK");
    const text = await res.text();
    assert.ok(text.includes("User-agent: *") || text.includes("User-Agent: *"), "Specifies User-agent: *");
    assert.ok(text.includes("/admin"), "Disallows /admin routes");
    assert.ok(text.includes("/api/"), "Disallows /api/ routes");
    assert.ok(text.includes("sitemap.xml"), "Includes sitemap.xml URL reference");
  });

  // 2. Sitemap.xml
  await test("2: Sitemap.xml generates valid XML and indexes products and collections", async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.strictEqual(res.status, 200, "sitemap.xml must return 200 OK");
    const xml = await res.text();
    assert.ok(xml.includes("<urlset") || xml.includes("xmlns="), "Valid XML urlset structure");
    assert.ok(xml.includes("https://velore.com/shop"), "Contains /shop URL");
    assert.ok(xml.includes("https://velore.com/products/noir"), "Contains Noir product URL");
    assert.ok(xml.includes("https://velore.com/collections/best-sellers"), "Contains best-sellers collection URL");
    assert.ok(xml.includes("https://velore.com/fragrance-finder"), "Contains fragrance finder URL");
  });

  // 3. Homepage SEO & Schema.org JSON-LD
  await test("3: Homepage serves OpenGraph tags and Organization / WebSite JSON-LD", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("VELORÉ"), "Contains brand title");
    assert.ok(html.includes("application/ld+json"), "Contains JSON-LD script tags");
    assert.ok(html.includes('"Organization"') || html.includes("&quot;Organization&quot;"), "Contains Organization schema");
    assert.ok(html.includes('"WebSite"') || html.includes("&quot;WebSite&quot;"), "Contains WebSite schema");
  });

  // 4. Product Detail Page JSON-LD
  await test("4: Product detail page serves Schema.org Product and BreadcrumbList", async () => {
    const res = await fetch(`${BASE_URL}/products/noir`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('"Product"') || html.includes("&quot;Product&quot;"), "Contains Product schema");
    assert.ok(html.includes('"BreadcrumbList"') || html.includes("&quot;BreadcrumbList&quot;"), "Contains BreadcrumbList schema");
    assert.ok(html.includes('"Offer"') || html.includes("&quot;Offer&quot;"), "Contains Offer schema");
    assert.ok(html.includes('"AggregateRating"') || html.includes("&quot;AggregateRating&quot;"), "Contains AggregateRating schema");
  });

  // 5. Collection Page JSON-LD
  await test("5: Collection detail page serves Schema.org CollectionPage and ItemList", async () => {
    const res = await fetch(`${BASE_URL}/collections/best-sellers`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('"CollectionPage"') || html.includes("&quot;CollectionPage&quot;"), "Contains CollectionPage schema");
    assert.ok(html.includes('"ItemList"') || html.includes("&quot;ItemList&quot;"), "Contains ItemList schema");
    assert.ok(html.includes('"BreadcrumbList"') || html.includes("&quot;BreadcrumbList&quot;"), "Contains BreadcrumbList schema");
  });

  console.log("\n============================================================");
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
