// Comprehensive End-to-End Verification Test Suite for VELORÉ E-Commerce Platform
// Modules 1 through 25
import assert from "node:assert";

const BASE_URL = "http://localhost:3000";
const RUN_ID = Date.now();

async function runComprehensiveVerification() {
  console.log("================================================================================");
  console.log("  VELORÉ HAUTE PARFUMERIE — COMPREHENSIVE END-TO-END VERIFICATION SUITE");
  console.log("================================================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(section, name, fn) {
    try {
      await fn();
      console.log(`✓ [PASS] [${section}] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] [${section}] ${name}:`, err.message);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // 1. STOREFRONT ROUTES ACCESSIBILITY (HTTP 200)
  // ---------------------------------------------------------------------------
  const routesToTest = [
    { path: "/", label: "Homepage" },
    { path: "/shop", label: "Shop Catalog" },
    { path: "/collections", label: "Collections Index" },
    { path: "/collections/best-sellers", label: "Collection Detail: Best Sellers" },
    { path: "/collections/woody", label: "Collection Detail: Woody" },
    { path: "/products/noir", label: "Product Detail: Noir" },
    { path: "/products/lumiere", label: "Product Detail: Lumiere" },
    { path: "/fragrance-finder", label: "Fragrance Finder Quiz" },
    { path: "/cart", label: "Shopping Bag" },
    { path: "/checkout", label: "Checkout Process" },
    { path: "/account", label: "Client Account Portal" },
    { path: "/our-story", label: "Our Story" },
    { path: "/about", label: "About Maison" },
    { path: "/journal", label: "Journal Articles" },
    { path: "/contact", label: "Contact Concierge" },
    { path: "/faqs", label: "Frequently Asked Questions" },
    { path: "/shipping", label: "Shipping Policy" },
    { path: "/returns", label: "Try First Guarantee & Returns" },
    { path: "/terms", label: "Terms of Service" },
    { path: "/privacy", label: "Privacy Policy" },
  ];

  for (const route of routesToTest) {
    await test("Routes", `Route ${route.path} (${route.label}) responds 200 OK`, async () => {
      const res = await fetch(`${BASE_URL}${route.path}`);
      assert.strictEqual(res.status, 200, `Expected 200 for ${route.path}`);
      const text = await res.text();
      assert.ok(text.length > 500, `Expected substantial HTML content for ${route.path}`);
    });
  }

  // ---------------------------------------------------------------------------
  // 2. SEO & STRUCTURED DATA
  // ---------------------------------------------------------------------------
  await test("SEO", "Robots.txt contains crawl rules and sitemap link", async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes("/admin"), "Disallows /admin");
    assert.ok(body.includes("sitemap.xml"), "Includes sitemap reference");
  });

  await test("SEO", "Sitemap.xml contains products and collections", async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.strictEqual(res.status, 200);
    const xml = await res.text();
    assert.ok(xml.includes("/products/noir"), "Contains product URL");
    assert.ok(xml.includes("/collections/best-sellers"), "Contains collection URL");
  });

  await test("SEO", "Product detail page contains Schema.org JSON-LD structured data", async () => {
    const res = await fetch(`${BASE_URL}/products/noir`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('"Product"') || html.includes("&quot;Product&quot;"), "Contains Product schema");
    assert.ok(html.includes('"BreadcrumbList"') || html.includes("&quot;BreadcrumbList&quot;"), "Contains BreadcrumbList schema");
  });

  // ---------------------------------------------------------------------------
  // 3. SECURITY HEADERS & HARDENING
  // ---------------------------------------------------------------------------
  await test("Security", "Server delivers strict HTTP security headers", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const csp = res.headers.get("content-security-policy");
    const xfo = res.headers.get("x-frame-options");
    const xcto = res.headers.get("x-content-type-options");
    const rp = res.headers.get("referrer-policy");

    assert.ok(csp && csp.includes("default-src 'self'"), "CSP header present");
    assert.strictEqual(xfo, "DENY", "X-Frame-Options DENY present");
    assert.strictEqual(xcto, "nosniff", "X-Content-Type-Options nosniff present");
    assert.ok(rp, "Referrer-Policy present");
  });

  // ---------------------------------------------------------------------------
  // 4. COUPONS & PROMOTIONAL DISCOUNT SYSTEM
  // ---------------------------------------------------------------------------
  await test("Coupons", "Validate percentage coupon VELORE10 (10% off)", async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "VELORE10",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.valid, true);
    assert.strictEqual(data.coupon.discountType, "percentage");
    assert.strictEqual(data.coupon.discountValue, 10);
  });

  await test("Coupons", "Reject invalid coupon code gracefully", async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "INVALID_PROMO_XYZ",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.valid, false);
    assert.ok(data.error.toLowerCase().includes("promotional code") || data.error.toLowerCase().includes("invalid"));
  });

  // ---------------------------------------------------------------------------
  // 5. ORDER PLACEMENT & INVENTORY SYSTEM
  // ---------------------------------------------------------------------------
  let testOrderId = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
  const testCustomerEmail = `e2e.tester.${RUN_ID}@velore-test.com`;

  await test("Orders", "Create confirmed order via /api/orders", async () => {
    const orderPayload = {
      id: testOrderId,
      createdAt: new Date().toISOString(),
      customer: {
        email: testCustomerEmail,
        firstName: "Victoria",
        lastName: "Sinclair",
        phone: "+1 555-0199",
      },
      shippingAddress: {
        street: "10 Avenue Montaigne",
        city: "Paris",
        state: "Ile-de-France",
        postalCode: "75008",
        country: "France",
      },
      shippingMethod: {
        id: "standard",
        name: "Artisan Complimentary Courier Dispatch",
        price: 0,
        estimatedDelivery: "3–5 business days",
      },
      paymentMethod: "Demo Card (ending in 4242)",
      samples: ["Santal Précieux (2ml Extrait)", "Rose Nocturne (2ml Extrait)"],
      items: [
        {
          id: "item-e2e-1",
          productId: "velore-noir-01",
          name: "Noir",
          slug: "noir",
          size: "100ml Extrait de Parfum",
          price: 310,
          quantity: 1,
        },
      ],
      subtotal: 310,
      shipping: 0,
      tax: 24.8,
      discount: 0,
      total: 334.8,
      status: "Processing",
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderPayload }),
    });
    assert.ok(res.status === 201 || res.status === 200, `Expected 201 or 200, got ${res.status}`);
    const data = await res.json();
    assert.ok(data.order && data.order.id, "Expected confirmed order object");
    testOrderId = data.order.id;
  });

  // ---------------------------------------------------------------------------
  // 6. CUSTOMER REVIEWS & RATINGS (WITH VERIFIED PURCHASE)
  // ---------------------------------------------------------------------------
  let e2eReviewId = null;
  await test("Reviews", "Verified customer review immediately published", async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "noir",
        customerEmail: testCustomerEmail, // Ordered noir above!
        customerName: "Victoria Sinclair",
        rating: 5,
        title: "Transcendent Masterpiece",
        body: "The opening smoky facets melt into a warm, lingering bourbon vanilla and leather. Simply incomparable.",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.review.verifiedPurchase, true, "Must be verified purchase");
    assert.strictEqual(data.review.status, "published", "Verified review must be published");
    e2eReviewId = data.review.id;
  });

  await test("Reviews", "Helpful voting increments count", async () => {
    assert.ok(e2eReviewId);
    const res = await fetch(`${BASE_URL}/api/reviews/${e2eReviewId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId: `e2e-voter-${RUN_ID}` }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.helpfulVotes, 1);
  });

  // ---------------------------------------------------------------------------
  // 7. ADMIN DASHBOARD & SECURITY CONTROLS
  // ---------------------------------------------------------------------------
  await test("Admin", "Unauthenticated admin request returns 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products`);
    assert.strictEqual(res.status, 401);
  });

  let adminCookie = "";
  await test("Admin", "Admin authentication login returns valid session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@velore.com",
        password: "VeloreAdmin2026!",
      }),
    });
    assert.strictEqual(res.status, 200);
    adminCookie = res.headers.get("set-cookie")?.split(";")[0] || "";
    assert.ok(adminCookie.length > 10, "Admin cookie present");
  });

  await test("Admin", "Admin access to products API with cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.products));
    assert.ok(data.products.length >= 20);
  });

  await test("Admin", "Admin access to orders API retrieves placed order", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.orders));
    assert.ok(data.orders.some((o) => o.id === testOrderId));
  });

  await test("Admin", "Admin access to reviews moderation", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/reviews`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.metrics);
    assert.ok(Array.isArray(data.reviews));
  });

  // Clean up review created in test
  if (e2eReviewId) {
    await test("Admin", "Clean up test review via Admin API", async () => {
      const res = await fetch(`${BASE_URL}/api/admin/reviews/${e2eReviewId}`, {
        method: "DELETE",
        headers: { Cookie: adminCookie },
      });
      assert.strictEqual(res.status, 200);
    });
  }

  console.log("\n================================================================================");
  console.log(`  SUMMARY: TOTAL ${passed + failed} SCENARIOS | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveVerification().catch((e) => {
  console.error("Comprehensive verification encountered error:", e);
  process.exit(1);
});
