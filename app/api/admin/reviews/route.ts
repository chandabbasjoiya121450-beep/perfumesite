import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import { getDbReviews } from "@/lib/server/store-db";

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
  const isReported = searchParams.get("reported") === "true";

  let reviews = getDbReviews({ status: status || undefined, isReported });

  if (search) {
    reviews = reviews.filter(
      (r) =>
        r.productName.toLowerCase().includes(search) ||
        r.title.toLowerCase().includes(search) ||
        r.body.toLowerCase().includes(search) ||
        r.customerName.toLowerCase().includes(search) ||
        r.customerEmail.toLowerCase().includes(search)
    );
  }

  const allReviews = getDbReviews();
  const metrics = {
    totalReviews: allReviews.length,
    publishedReviews: allReviews.filter((r) => r.status === "published").length,
    pendingReviews: allReviews.filter((r) => r.status === "pending").length,
    rejectedReviews: allReviews.filter((r) => r.status === "rejected").length,
    reportedReviews: allReviews.filter((r) => r.reports && r.reports.length > 0).length,
    averageRating:
      allReviews.filter((r) => r.status === "published").length > 0
        ? Math.round(
            (allReviews
              .filter((r) => r.status === "published")
              .reduce((sum, r) => sum + r.rating, 0) /
              allReviews.filter((r) => r.status === "published").length) *
              10
          ) / 10
        : 0,
  };

  return NextResponse.json({
    reviews,
    metrics,
  });
}
