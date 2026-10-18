import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import { getDbOrders } from "@/lib/server/store-db";

export async function GET(request: Request) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const orders = getDbOrders();

  // Metrics from real database orders only (no fabricated analytics)
  const eligibleOrders = orders.filter((o) => o.status !== "Cancelled");
  const realRevenue = eligibleOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter(
    (o) => o.status === "Preparing Dispatch" || o.status === "Confirmed"
  ).length;

  return NextResponse.json({
    orders,
    metrics: {
      totalOrders: orders.length,
      pendingOrders: pendingCount,
      deliveredOrders: orders.filter((o) => o.status === "Delivered").length,
      cancelledOrders: orders.filter((o) => o.status === "Cancelled").length,
      realRevenue,
      currency: "USD",
    },
  });
}
