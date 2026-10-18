import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import { getCampaignAnalytics, getDbCouponRedemptions, getDbCoupons } from "@/lib/server/store-db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const analytics = getCampaignAnalytics();
  const redemptions = getDbCouponRedemptions();
  const coupons = getDbCoupons();

  // Campaign performance breakdown
  const campaignBreakdown = coupons.map((c) => {
    const couponRedemptions = redemptions.filter((r) => r.couponId === c.id || r.couponCode === c.code);
    const totalDiscount = couponRedemptions.reduce((acc, r) => acc + r.discountAmount, 0);
    return {
      id: c.id,
      code: c.code,
      name: c.name,
      status: c.status,
      discountType: c.discountType,
      discountValue: c.discountValue,
      redemptionsCount: couponRedemptions.length,
      totalDiscountGranted: Math.round(totalDiscount * 100) / 100,
      usageLimit: c.usageLimit,
    };
  });

  return NextResponse.json({
    analytics,
    campaignBreakdown,
    recentRedemptions: redemptions.slice(0, 20),
  });
}
