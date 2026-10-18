import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import { updateDbReviewStatus, deleteDbReview, getDbReviewById } from "@/lib/server/store-db";

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

  const review = getDbReviewById(params.id);
  if (!review) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  return NextResponse.json({ review });
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
    const { status, moderationNote } = body;

    if (!["published", "pending", "rejected", "removed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid review status. Permitted: published, pending, rejected, removed." },
        { status: 400 }
      );
    }

    const result = updateDbReviewStatus(params.id, status, moderationNote);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ review: result.review });
  } catch (error) {
    console.error("[ADMIN API] Error updating review status:", error);
    return NextResponse.json(
      { error: "Failed to update review status." },
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

  const result = deleteDbReview(params.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Review deleted successfully." });
}
