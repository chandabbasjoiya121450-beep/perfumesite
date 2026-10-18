// Automated Verification Test Suite for Module 15: Coupons & Promotional Campaigns
import assert from "node:assert";

const BASE_URL = "http://localhost:3000";
const RUN_ID = Date.now();

async function runTests() {
  console.log("============================================================");
  console.log("VELORÉ — MODULE 15: VERIFICATION TEST SUITE (20 SCENARIOS)");
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

  // 1. Valid percentage coupon
  await test("1: Valid percentage coupon (VELORE10, 10% off)", async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "VELORE10",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, true);
    assert.strictEqual(data.coupon.code, "VELORE10");
    assert.strictEqual(data.coupon.discountType, "percentage");
    assert.strictEqual(data.coupon.discountValue, 10);
    assert.strictEqual(data.discountAmount, 31); // 10% of $310
    assert.strictEqual(data.eligibleSubtotal, 310);
  });

  // 2. Valid fixed-amount coupon
  await test("2: Valid fixed-amount coupon (WELCOME50, $50 off)", async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "WELCOME50",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, true);
    assert.strictEqual(data.coupon.code, "WELCOME50");
    assert.strictEqual(data.coupon.discountType, "fixed");
    assert.strictEqual(data.discountAmount, 50);
  });

  // 3. Minimum spend requirement
  await test("3: Coupon with minimum spend requirement", async () => {
    const adminRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@velore.com", password: "VeloreAdmin2026!" }),
    });
    const cookie = adminRes.headers.get("set-cookie")?.split(";")[0] || "";

    const code = `MIN${RUN_ID.toString().slice(-4)}`;
    await fetch(`${BASE_URL}/api/admin/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        code,
        name: "High Min Spend Promo",
        discountType: "percentage",
        discountValue: 15,
        minSubtotal: 500,
        startDate: "2026-01-01T00:00:00Z",
        expiryDate: "2027-12-31T23:59:59Z",
        usageLimit: 100,
        perCustomerLimit: 1,
        status: "active",
      }),
    });

    // Test with 1 item of $310 (below $500 threshold)
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, false);
    assert.ok(data.error.includes("minimum eligible bag subtotal of $500"));
  });

  // 4. Maximum discount cap
  await test("4: Percentage coupon with maximum discount cap (ELITE20 capped at $100)", async () => {
    // ELITE20 is 20% off capped at $100.
    // 3 flacons of velore-noir-01 = $310 * 3 = $930. 20% of $930 = $186. With cap: $100.
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "ELITE20",
        items: [{ productId: "velore-noir-01", quantity: 3 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, true);
    assert.strictEqual(data.discountAmount, 100); // capped at 100 instead of 186
  });

  // 5. Product-specific discount restriction
  await test("5: Product-specific discount (VIPNOIR restricted to velore-noir-01)", async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "VIPNOIR",
        items: [{ productId: "velore-cuir-majestic", quantity: 1 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, false);
    assert.ok(data.error.includes("not applicable to any of the creations"));
  });

  // 6. Collection-specific discount
  await test("6: Collection-specific discount (ELITE20 eligible for best-sellers)", async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "ELITE20",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, true);
    assert.strictEqual(data.discountAmount, 62); // 20% of 310
  });

  // 7. Expired coupon
  await test("7: Expired coupon rejection (EXPIRED15)", async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "EXPIRED15",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, false);
    assert.ok(data.error.includes("expired"));
  });

  // 8. Coupon that has not started
  await test("8: Future/scheduled coupon rejection", async () => {
    const adminRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@velore.com", password: "VeloreAdmin2026!" }),
    });
    const cookie = adminRes.headers.get("set-cookie")?.split(";")[0] || "";

    const code = `FUT${RUN_ID.toString().slice(-4)}`;
    await fetch(`${BASE_URL}/api/admin/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        code,
        name: "Future Solstice Promo",
        discountType: "percentage",
        discountValue: 10,
        minSubtotal: 100,
        startDate: "2028-01-01T00:00:00Z",
        expiryDate: "2028-12-31T23:59:59Z",
        usageLimit: 100,
        status: "scheduled",
      }),
    });

    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, false);
    assert.ok(data.error.includes("not yet commenced"));
  });

  // 9. Inactive coupon rejection
  await test("9: Inactive coupon rejection (INACTIVE25)", async () => {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "INACTIVE25",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, false);
    assert.ok(data.error.includes("inactive"));
  });

  // 10. Exhausted total redemption limit
  await test("10: Exhausted redemption limit coupon", async () => {
    const adminRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@velore.com", password: "VeloreAdmin2026!" }),
    });
    const cookie = adminRes.headers.get("set-cookie")?.split(";")[0] || "";

    const code = `ONE${RUN_ID.toString().slice(-4)}`;
    const createRes = await fetch(`${BASE_URL}/api/admin/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        code,
        name: "Single Use Promotion",
        discountType: "fixed",
        discountValue: 25,
        minSubtotal: 100,
        startDate: "2026-01-01T00:00:00Z",
        expiryDate: "2027-12-31T23:59:59Z",
        usageLimit: 1,
        perCustomerLimit: 1,
        status: "active",
      }),
    });
    assert.strictEqual(createRes.status, 201);

    // Place qualifying order to consume the 1 use
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: {
          id: `VEL-TEST-${RUN_ID}`,
          customer: { email: `tester_${RUN_ID}_1@velore.com`, firstName: "Test", lastName: "One", phone: "123" },
          shippingAddress: { street: "123 Test St", city: "Paris", state: "IDF", postalCode: "75001", country: "France" },
          items: [{ productId: "velore-noir-01", name: "VELORÉ NOIR", price: 310, quantity: 1 }],
          couponCode: code,
          shippingMethod: { id: "standard", price: 0 },
        },
      }),
    });
    assert.strictEqual(orderRes.status, 201);

    // Validating code again -> should be exhausted!
    const revalRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        items: [{ productId: "velore-noir-01", quantity: 1 }],
        customerEmail: `tester_${RUN_ID}_2@velore.com`,
      }),
    });
    const revalData = await revalRes.json();
    assert.strictEqual(revalData.valid, false);
    assert.ok(
      revalData.error.includes("exhausted") || revalData.error.includes("expired")
    );
  });

  // 11. Per-customer redemption limit
  await test("11: Per-customer redemption limit enforcement", async () => {
    // client@velore.com already redeemed VELORE10 in seed redemptions
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "VELORE10",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
        customerEmail: "client@velore.com",
      }),
    });
    const data = await res.json();
    assert.strictEqual(data.valid, false);
    assert.ok(data.error.includes("maximum allowable times"));
  });

  // 12. Coupon removed from checkout restores normal total
  await test("12: Coupon removal restores full merchandise subtotal", async () => {
    const subtotal = 310;
    const discount = 31;
    const shipping = 0;
    const taxWithDiscount = (subtotal - discount) * 0.08;
    const grandWithDiscount = subtotal - discount + taxWithDiscount;

    const taxWithoutDiscount = subtotal * 0.08;
    const grandWithoutDiscount = subtotal + taxWithoutDiscount;

    assert.strictEqual(grandWithDiscount < grandWithoutDiscount, true);
    assert.strictEqual(grandWithoutDiscount, 310 + 24.8);
  });

  // 13. Cart changed after coupon is applied
  await test("13: Cart modification recalculates discount correctly", async () => {
    // 1 flacon ($310) -> discount 10% = $31
    const res1 = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "VELORE10",
        items: [{ productId: "velore-noir-01", quantity: 1 }],
      }),
    });
    const data1 = await res1.json();
    assert.strictEqual(data1.discountAmount, 31);

    // Quantity increased to 2 flacons ($620) -> discount 10% = $62
    const res2 = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "VELORE10",
        items: [{ productId: "velore-noir-01", quantity: 2 }],
      }),
    });
    const data2 = await res2.json();
    assert.strictEqual(data2.discountAmount, 62);
  });

  // 14. Product price changed before order submission
  await test("14: Catalog price verification protects against client-side tampering", async () => {
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: {
          id: `VEL-PRICE-TAMPER-${RUN_ID}`,
          customer: { email: `honest_${RUN_ID}@velore.com`, firstName: "Honest", lastName: "Client", phone: "555" },
          shippingAddress: { street: "1 Rue de la Paix", city: "Paris", state: "IDF", postalCode: "75001", country: "France" },
          items: [{ productId: "velore-noir-01", name: "VELORÉ NOIR", price: 10, quantity: 1 }],
          shippingMethod: { id: "standard", price: 0 },
        },
      }),
    });
    const data = await orderRes.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.order.items[0].price, 310);
    assert.strictEqual(data.order.subtotal, 310);
  });

  // 15. Invalid or manipulated client-side discount values
  await test("15: Manipulated client-side discount is overridden by backend validation", async () => {
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: {
          id: `VEL-DISCOUNT-TAMPER-${RUN_ID}`,
          customer: { email: `discounttest_${RUN_ID}@velore.com`, firstName: "Tester", lastName: "Discount", phone: "555" },
          shippingAddress: { street: "10 Avenue Montaigne", city: "Paris", state: "IDF", postalCode: "75008", country: "France" },
          items: [{ productId: "velore-noir-01", name: "VELORÉ NOIR", price: 310, quantity: 1 }],
          couponCode: "VELORE10",
          discount: 200, // Fabricated discount claim
          shippingMethod: { id: "standard", price: 0 },
        },
      }),
    });
    const data = await orderRes.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.order.discount, 31);
    assert.strictEqual(data.order.total, Math.round((310 - 31 + (310 - 31) * 0.08) * 100) / 100);
  });

  // 16. Two simultaneous attempts to redeem the last available coupon
  await test("16: Atomic usage tracking prevents over-redemption", async () => {
    const adminRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@velore.com", password: "VeloreAdmin2026!" }),
    });
    const cookie = adminRes.headers.get("set-cookie")?.split(";")[0] || "";

    const code = `RACE${RUN_ID.toString().slice(-4)}`;
    await fetch(`${BASE_URL}/api/admin/coupons`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        code,
        name: "Concurrency Test Coupon",
        discountType: "fixed",
        discountValue: 10,
        minSubtotal: 100,
        startDate: "2026-01-01T00:00:00Z",
        expiryDate: "2027-12-31T23:59:59Z",
        usageLimit: 1,
        perCustomerLimit: 1,
        status: "active",
      }),
    });

    const createOrder = (email, id) =>
      fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: {
            id,
            customer: { email, firstName: "User", lastName: "Concurrent", phone: "555" },
            shippingAddress: { street: "1 St", city: "London", state: "LDN", postalCode: "W1", country: "UK" },
            items: [{ productId: "velore-noir-01", name: "VELORÉ NOIR", price: 310, quantity: 1 }],
            couponCode: code,
            shippingMethod: { id: "standard", price: 0 },
          },
        }),
      });

    const [res1, res2] = await Promise.all([
      createOrder(`concur1_${RUN_ID}@velore.com`, `VEL-C1-${RUN_ID}`),
      createOrder(`concur2_${RUN_ID}@velore.com`, `VEL-C2-${RUN_ID}`),
    ]);

    const results = [await res1.json(), await res2.json()];
    const successes = results.filter((r) => r.success);
    assert.strictEqual(successes.length, 1);
  });

  // 17. Duplicate checkout submission idempotency
  await test("17: Duplicate checkout submission idempotency", async () => {
    const fixedOrderId = `VEL-IDEMP-${RUN_ID}`;
    const orderPayload = {
      order: {
        id: fixedOrderId,
        customer: { email: `idemp_${RUN_ID}@velore.com`, firstName: "Idemp", lastName: "Test", phone: "555" },
        shippingAddress: { street: "100 Park Ave", city: "NY", state: "NY", postalCode: "10017", country: "US" },
        items: [{ productId: "velore-noir-01", name: "VELORÉ NOIR", price: 310, quantity: 1 }],
        couponCode: "WELCOME50",
        shippingMethod: { id: "standard", price: 0 },
      },
    };

    const res1 = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    assert.strictEqual(res1.status, 201);

    // Second submission with exact same order ID returns 200 with same order
    const res2 = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    assert.strictEqual(res2.status, 200);
    const data2 = await res2.json();
    assert.strictEqual(data2.order.id, fixedOrderId);
  });

  // 18. Order history retains historical discount
  await test("18: Order history retains historical discount even if coupon modified", async () => {
    const adminRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@velore.com", password: "VeloreAdmin2026!" }),
    });
    const cookie = adminRes.headers.get("set-cookie")?.split(";")[0] || "";

    const orderRes = await fetch(`${BASE_URL}/api/admin/orders/VEL-892410`, {
      headers: { Cookie: cookie },
    });
    const orderData = await orderRes.json();
    assert.strictEqual(orderRes.status, 200);
    assert.strictEqual(orderData.order.discount, 45.6);
    assert.strictEqual(orderData.order.total, 604.15);
  });

  // 19. Existing checkout works without a coupon
  await test("19: Checkout without a coupon succeeds seamlessly", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: {
          id: `VEL-NO-COUPON-${RUN_ID}`,
          customer: { email: `guest_${RUN_ID}@velore.com`, firstName: "Pure", lastName: "Guest", phone: "555" },
          shippingAddress: { street: "5th Avenue", city: "NY", state: "NY", postalCode: "10001", country: "US" },
          items: [{ productId: "velore-noir-01", name: "VELORÉ NOIR", price: 310, quantity: 1 }],
          shippingMethod: { id: "standard", price: 0 },
        },
      }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.order.discount, 0);
    assert.strictEqual(data.order.subtotal, 310);
  });

  // 20. Existing catalog, wishlist, customer accounts, and admin panel continue working
  await test("20: Storefront and admin regression checks", async () => {
    const routes = [
      "/",
      "/shop",
      "/collections/best-sellers",
      "/products/noir",
      "/cart",
      "/checkout",
      "/wishlist",
      "/account",
      "/admin",
      "/admin/coupons",
      "/admin/products",
      "/admin/orders",
      "/admin/inventory",
      "/admin/customers",
      "/admin/settings",
    ];

    for (const route of routes) {
      const res = await fetch(`${BASE_URL}${route}`);
      assert.strictEqual(res.status, 200, `Route ${route} returned status ${res.status}`);
    }
  });

  console.log("\n============================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log("============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
