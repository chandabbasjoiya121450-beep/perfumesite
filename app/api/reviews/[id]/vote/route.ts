import { NextRequest, NextResponse } from "next/server";
import { voteHelpfulReview } from "@/lib/server/store-db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json().catch(() => ({}));
    const userIdentifier =
      body.userIdentifier ||
      req.headers.get("x-forwarded-for") ||
      "client-patron";

    const result = voteHelpfulReview(params.id, userIdentifier);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, helpfulVotes: result.helpfulVotes });
  } catch (error) {
    console.error("[API] Error voting on review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register helpful vote." },
      { status: 500 }
    );
  }
}
