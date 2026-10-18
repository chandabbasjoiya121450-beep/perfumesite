import { NextRequest, NextResponse } from "next/server";
import { reportDbReview } from "@/lib/server/store-db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const { reason, notes, reporterIdentifier } = body;

    const identifier =
      reporterIdentifier ||
      req.headers.get("x-forwarded-for") ||
      "anonymous-client";

    const result = reportDbReview(params.id, reason || "other", identifier, notes);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you. Your report has been submitted for confidential moderation.",
    });
  } catch (error) {
    console.error("[API] Error reporting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review report." },
      { status: 500 }
    );
  }
}
