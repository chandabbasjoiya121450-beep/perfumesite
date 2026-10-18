import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import { getDbSettings, updateDbSettings } from "@/lib/server/store-db";

export async function GET(request: Request) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const settings = getDbSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validate settings fields
    if (body.storeName && !body.storeName.trim()) {
      return NextResponse.json({ error: "Store name cannot be empty." }, { status: 400 });
    }

    if (body.freeShippingThreshold !== undefined) {
      const threshold = Number(body.freeShippingThreshold);
      if (isNaN(threshold) || threshold < 0) {
        return NextResponse.json(
          { error: "Free shipping threshold must be a non-negative number." },
          { status: 400 }
        );
      }
    }

    if (body.lowStockThreshold !== undefined) {
      const threshold = Number(body.lowStockThreshold);
      if (isNaN(threshold) || threshold < 0) {
        return NextResponse.json(
          { error: "Low stock threshold must be a non-negative integer." },
          { status: 400 }
        );
      }
    }

    const updated = updateDbSettings(body, session.email);

    return NextResponse.json({
      success: true,
      settings: updated,
      message: "Store configuration saved successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update store settings." },
      { status: 500 }
    );
  }
}
