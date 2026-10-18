import { NextRequest, NextResponse } from "next/server";
import {
  getDbReviews,
  createDbReview,
  getProductRatingSummary,
} from "@/lib/server/store-db";

export const dynamic = "force-dynamic";

/**
 * Public storefront endpoint for customer reviews and product rating summaries.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || undefined;
    const customerEmail = searchParams.get("customerEmail") || undefined;
    const sort = searchParams.get("sort") || "recent";

    // If customerEmail is specified (for account portal), filter by customer; otherwise public requests only see published reviews
    let reviews = customerEmail
      ? getDbReviews({ customerEmail })
      : getDbReviews({ productId, status: "published" });

    // Apply sorting
    if (sort === "highest") {
      reviews.sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "lowest") {
      reviews.sort((a, b) => a.rating - b.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "helpful") {
      reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes || b.rating - a.rating);
    } else {
      // Default: recent
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const ratingSummary = productId ? getProductRatingSummary(productId) : null;

    return NextResponse.json({
      reviews,
      ratingSummary,
    });
  } catch (error) {
    console.error("[API] Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reviews." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, customerEmail, customerName, rating, title, body: reviewBody } = body;

    const result = createDbReview({
      productId,
      customerEmail,
      customerName,
      rating: Number(rating),
      title,
      body: reviewBody,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, review: result.review }, { status: 201 });
  } catch (error) {
    console.error("[API] Error submitting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit customer review." },
      { status: 500 }
    );
  }
}
