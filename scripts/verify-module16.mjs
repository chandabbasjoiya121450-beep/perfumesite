// Automated Verification Test Suite for Module 16: Customer Reviews & Ratings
import assert from "node:assert";

const BASE_URL = "http://localhost:3000";
const RUN_ID = Date.now();

async function runTests() {
  console.log("============================================================");
  console.log("VELORÉ — MODULE 16: VERIFICATION TEST SUITE (REVIEWS & RATINGS)");
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

  // 1. Fetch published reviews for a product (Noir)
  await test("1: Fetch published reviews and rating summary for product 'noir'", async () => {
    const res = await fetch(`${BASE_URL}/api/reviews?productId=noir`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.reviews), "Expected reviews array");
    assert.ok(data.reviews.length >= 1, "Expected at least 1 review for noir");
    assert.ok(data.ratingSummary, "Expected ratingSummary object");
    assert.ok(data.ratingSummary.average >= 1 && data.ratingSummary.average <= 5, "Rating average within range");
    assert.ok(data.ratingSummary.count >= 1, "Rating count matches");
    assert.strictEqual(typeof data.ratingSummary.distribution, "object", "Distribution present");
  });

  // 2. Sorting reviews (highest, lowest, helpful, recent)
  await test("2: Sorting reviews by highest rating", async () => {
    const res = await fetch(`${BASE_URL}/api/reviews?productId=noir&sort=highest`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.reviews));
    for (let i = 0; i < data.reviews.length - 1; i++) {
      assert.ok(data.reviews[i].rating >= data.reviews[i + 1].rating, "Reviews should be descending by rating");
    }
  });

  // 3. Unverified reviewer submission -> must go to 'pending'
  const unverifiedEmail = `patron.${RUN_ID}@example-guest.com`;
  let submittedReviewId = null;

  await test("3: Unverified purchase submission creates 'pending' review", async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "noir",
        customerEmail: unverifiedEmail,
        customerName: "Discerning Visitor",
        rating: 5,
        title: "Intriguing Olfactory Depth",
        body: "Sampled this fragrance at a private salon. Exceptional sillage with smoky vetiver nuances.",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.review, "Review returned");
    assert.strictEqual(data.review.verifiedPurchase, false, "Should not be verified purchase");
    assert.strictEqual(data.review.status, "pending", "Unverified review should be placed into pending moderation");
    submittedReviewId = data.review.id;
  });

  // 4. Duplicate review prevention
  await test("4: Duplicate review submission from same email on same product is rejected", async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "noir",
        customerEmail: unverifiedEmail,
        customerName: "Discerning Visitor",
        rating: 4,
        title: "Attempting duplicate review",
        body: "Attempting to submit another review for the same fragrance from same email.",
      }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes("already submitted"));
  });

  // 5. Validation error handling (missing fields / bad rating)
  await test("5: Validation errors on invalid rating / empty body", async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "noir",
        customerEmail: "invalid@test.com",
        customerName: "Test",
        rating: 7, // Invalid rating > 5
        title: "Bad",
        body: "Short",
      }),
    });
    assert.strictEqual(res.status, 400);
  });

  // 6. Helpful voting endpoint
  await test("6: Voting a review as helpful increments vote count", async () => {
    assert.ok(submittedReviewId, "Requires submitted review ID");
    const voterId = `voter-${RUN_ID}`;
    const res = await fetch(`${BASE_URL}/api/reviews/${submittedReviewId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.helpfulVotes, 1);

    // Repeated vote from same voter should be rejected
    const repeatRes = await fetch(`${BASE_URL}/api/reviews/${submittedReviewId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId }),
    });
    assert.strictEqual(repeatRes.status, 400);
  });

  // 7. Review reporting endpoint
  await test("7: Reporting a review tracks reason and category", async () => {
    assert.ok(submittedReviewId, "Requires submitted review ID");
    const res = await fetch(`${BASE_URL}/api/reviews/${submittedReviewId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason: "suspected_inaccuracy",
        details: "Automated test report flag",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  // Admin Authentication Setup
  let adminCookie = "";
  await test("8a: Admin authentication login", async () => {
    const adminRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@velore.com", password: "VeloreAdmin2026!" }),
    });
    assert.strictEqual(adminRes.status, 200);
    adminCookie = adminRes.headers.get("set-cookie")?.split(";")[0] || "";
    assert.ok(adminCookie.length > 0, "Admin cookie received");
  });

  // 8. Admin reviews list and moderation summary
  await test("8: Admin reviews API returns metrics and filtered items", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/reviews`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.reviews), "Expected reviews list");
    assert.ok(data.metrics, "Expected metrics summary");
    assert.ok(typeof data.metrics.totalReviews === "number");
    assert.ok(typeof data.metrics.pendingReviews === "number");
    assert.ok(typeof data.metrics.reportedReviews === "number");
  });

  // 9. Admin moderating review (transitioning pending -> published)
  await test("9: Admin can approve and publish a pending review with notes", async () => {
    assert.ok(submittedReviewId, "Requires submitted review ID");
    const res = await fetch(`${BASE_URL}/api/admin/reviews/${submittedReviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        status: "published",
        moderationNote: "Approved by Chief Fragrance Curator",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.review.status, "published");
    assert.strictEqual(data.review.moderationNote, "Approved by Chief Fragrance Curator");
  });

  // 10. Querying account reviews by customerEmail
  await test("10: Query reviews by customerEmail returns customer's submissions", async () => {
    const res = await fetch(`${BASE_URL}/api/reviews?customerEmail=${encodeURIComponent(unverifiedEmail)}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.reviews));
    assert.ok(data.reviews.some((r) => r.id === submittedReviewId));
  });

  // 11. Cleanup test review via Admin DELETE
  await test("11: Admin can delete test review", async () => {
    assert.ok(submittedReviewId, "Requires submitted review ID");
    const res = await fetch(`${BASE_URL}/api/admin/reviews/${submittedReviewId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  console.log("\n============================================================");
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution aborted:", e);
  process.exit(1);
});
