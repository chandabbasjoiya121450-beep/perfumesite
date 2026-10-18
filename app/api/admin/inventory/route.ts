import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import {
  getDbProducts,
  adjustProductInventory,
  getInventoryHistory,
} from "@/lib/server/store-db";

export async function GET(request: Request) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  const products = getDbProducts(true);
  const history = getInventoryHistory();

  const inventoryItems = products.map((p) => {
    const stock = p.stock ?? 0;
    const threshold = p.lowStockThreshold ?? 10;
    const isLowStock = stock <= threshold && stock > 0;
    const isOutOfStock = stock === 0;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku || `VEL-${p.slug.toUpperCase().slice(0, 8)}-100`,
      image: p.images?.[0] || p.image,
      family: p.family,
      price: p.price,
      stock,
      lowStockThreshold: threshold,
      isAvailable: p.isAvailable,
      status: p.status || "published",
      isLowStock,
      isOutOfStock,
      updatedAt: p.updatedAt,
    };
  });

  return NextResponse.json({
    inventory: inventoryItems,
    history,
    totalProducts: inventoryItems.length,
    lowStockCount: inventoryItems.filter((i) => i.isLowStock).length,
    outOfStockCount: inventoryItems.filter((i) => i.isOutOfStock).length,
  });
}

export async function POST(request: Request) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Administrator privileges required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { productId, adjustment, reason } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const numAdj = Number(adjustment);
    if (isNaN(numAdj)) {
      return NextResponse.json({ error: "Adjustment must be a valid number." }, { status: 400 });
    }

    const result = adjustProductInventory(productId, numAdj, reason, session.email);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      product: result.product,
      message: `Inventory updated successfully. New stock: ${result.product?.stock}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to adjust inventory." },
      { status: 500 }
    );
  }
}
