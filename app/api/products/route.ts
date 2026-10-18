import { NextResponse } from "next/server";
import { getDbProducts } from "@/lib/server/store-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = getDbProducts(false); // only published & available
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to retrieve products" }, { status: 500 });
  }
}
