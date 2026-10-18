import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import {
  getDbCoupons,
  createDbCoupon,
  getCampaignAnalytics,
} from "@/lib/server/store-db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase();
  const status = searchParams.get("status");

  let coupons = getDbCoupons();

  if (search) {
    coupons = coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(search) ||
        c.name.toLowerCase().includes(search) ||
        c.description?.toLowerCase().includes(search)
    );
  }

  if (status && status !== "all") {
    coupons = coupons.filter((c) => c.status === status);
  }

  const analytics = getCampaignAnalytics();

  return NextResponse.json({
    coupons,
    analytics,
  });
}

export async function POST(req: NextRequest) {
  const session = verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const result = createDbCoupon({
      code: body.code,
      name: body.name,
      description: body.description,
      discountType: body.discountType || "percentage",
      discountValue: Number(body.discountValue),
      currency: body.currency || "USD",
      minSubtotal: Number(body.minSubtotal || 0),
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      startDate: body.startDate,
      expiryDate: body.expiryDate,
      usageLimit: Number(body.usageLimit || 0),
      perCustomerLimit: Number(body.perCustomerLimit || 1),
      eligibleProductIds: body.eligibleProductIds || [],
      eligibleCollectionIds: body.eligibleCollectionIds || [],
      excludedProductIds: body.excludedProductIds || [],
      canCombineWithOtherCoupons: Boolean(body.canCombineWithOtherCoupons),
      status: body.status || "active",
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ coupon: result.coupon }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN API] Error creating coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon campaign." },
      { status: 500 }
    );
  }
}
