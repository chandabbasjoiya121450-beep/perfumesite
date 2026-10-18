import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import { getDbOrderById, updateDbOrderStatus } from "@/lib/server/store-db";

interface RouteParams {
  params: { orderId: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const order = getDbOrderById(params.orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { status, notes } = body;

    const validStatuses = ["Confirmed", "Preparing Dispatch", "In Transit", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid fulfillment status. Allowed: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const result = updateDbOrderStatus(params.orderId, status, notes);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      message: `Order ${params.orderId} status updated to ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update order status." },
      { status: 500 }
    );
  }
}
