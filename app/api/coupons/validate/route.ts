import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/server/store-db";

export const dynamic = "force-dynamic";

/**
 * Public storefront endpoint for coupon and discount validation.
 * Recomputes discounts against genuine server-side catalog prices.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, items, customerEmail } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, error: "Please enter a promotional code." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { valid: false, error: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    const result = validateCoupon(code, items, customerEmail);

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          error: result.error || "This promotional code is not valid for your current bag.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        coupon: result.coupon,
        discountAmount: result.discountAmount,
        eligibleSubtotal: result.eligibleSubtotal,
        totalSubtotal: result.totalSubtotal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error validating coupon:", error);
    return NextResponse.json(
      { valid: false, error: "An unexpected error occurred while validating your promotion." },
      { status: 500 }
    );
  }
}
