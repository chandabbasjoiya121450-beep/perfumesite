import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import {
  getDbCouponById,
  updateDbCoupon,
  deleteDbCoupon,
  toggleCouponStatus,
  getDbCouponRedemptions,
} from "@/lib/server/store-db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const coupon = getDbCouponById(params.id);
  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
  }

  const redemptions = getDbCouponRedemptions().filter(
    (r) => r.couponId === coupon.id || r.couponCode === coupon.code
  );

  return NextResponse.json({ coupon, redemptions });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    // Support toggle action
    if (body.action === "toggle") {
      const toggleRes = toggleCouponStatus(params.id);
      if (!toggleRes.success) {
        return NextResponse.json({ error: toggleRes.error }, { status: 400 });
      }
      return NextResponse.json({ coupon: toggleRes.coupon });
    }

    const updates = { ...body };
    delete updates.id;
    delete updates.action;

    const result = updateDbCoupon(params.id, updates);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ coupon: result.coupon });
  } catch (error) {
    console.error("[ADMIN API] Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon campaign." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const result = deleteDbCoupon(params.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Coupon deleted successfully." });
}
