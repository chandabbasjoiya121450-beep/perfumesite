import { NextRequest, NextResponse } from "next/server";
import {
  getStoreDb,
  saveStoreDb,
  validateCoupon,
  recordCouponRedemption,
  CustomerRecord,
} from "@/lib/server/store-db";
import { Order } from "@/lib/data/orders";

export const dynamic = "force-dynamic";

/**
 * Public storefront order creation endpoint.
 * Validates inventory, prices, coupon redemptions, and saves to database.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderData = body.order as Order;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order data or empty bag." },
        { status: 400 }
      );
    }

    if (!orderData.customer?.email || !orderData.shippingAddress?.street) {
      return NextResponse.json(
        { success: false, error: "Customer details and shipping destination are required." },
        { status: 400 }
      );
    }

    const db = getStoreDb();

    // Check idempotency: if order with this ID was already placed, return existing record
    if (orderData.id) {
      const existingOrder = db.orders.find((o) => o.id.toLowerCase() === orderData.id.toLowerCase());
      if (existingOrder) {
        return NextResponse.json(
          { success: true, order: existingOrder, message: "Order already confirmed." },
          { status: 200 }
        );
      }
    }

    // 1. Calculate and verify real pricing from catalog
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of orderData.items) {
      const product = db.products.find(
        (p) => p.id === item.productId || p.slug === item.slug || p.slug === item.productId
      );

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product "${item.name}" is no longer available in our catalog.` },
          { status: 400 }
        );
      }

      const unitPrice = product.price;
      const quantity = Math.max(1, Math.floor(item.quantity || 1));
      const lineTotal = unitPrice * quantity;
      verifiedSubtotal += lineTotal;

      verifiedItems.push({
        id: item.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        size: item.size || product.size,
        price: unitPrice,
        quantity,
        image: product.images?.[0] || product.image,
      });
    }

    // 2. Validate Coupon if provided
    let verifiedDiscount = 0;
    let appliedCoupon = null;

    if (orderData.couponCode) {
      const couponValidation = validateCoupon(
        orderData.couponCode,
        verifiedItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        orderData.customer.email
      );

      if (!couponValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            error:
              couponValidation.error ||
              "The promotional privilege applied is no longer valid. Please review your order.",
          },
          { status: 400 }
        );
      }

      verifiedDiscount = couponValidation.discountAmount || 0;
      appliedCoupon = couponValidation.coupon;
    }

    // 3. Compute shipping and tax based on verified store settings
    const settings = db.settings;
    const isExpress = orderData.shippingMethod?.id === "express";
    const shippingFee =
      isExpress
        ? settings.expressShippingFee || 25
        : verifiedSubtotal >= (settings.freeShippingThreshold || 150)
        ? 0
        : settings.standardShippingFee || 0;

    const taxableAmount = Math.max(0, verifiedSubtotal - verifiedDiscount);
    const taxRate = 0.08; // 8% standard luxury fragrance excise
    const verifiedTax = Math.round(taxableAmount * taxRate * 100) / 100;
    const verifiedTotal = Math.round((taxableAmount + shippingFee + verifiedTax) * 100) / 100;

    const orderId =
      orderData.id && orderData.id.startsWith("VEL-")
        ? orderData.id
        : `VEL-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmedOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      items: verifiedItems,
      subtotal: verifiedSubtotal,
      shipping: shippingFee,
      tax: verifiedTax,
      discount: verifiedDiscount,
      total: verifiedTotal,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      couponId: appliedCoupon ? appliedCoupon.id : undefined,
      couponName: appliedCoupon ? appliedCoupon.name : undefined,
      status: "Preparing Dispatch",
    };

    // 4. Save to database orders
    db.orders.unshift(confirmedOrder);

    // 5. Record coupon redemption atomically
    if (appliedCoupon && verifiedDiscount > 0) {
      recordCouponRedemption({
        couponId: appliedCoupon.id,
        orderId: confirmedOrder.id,
        customerEmail: confirmedOrder.customer.email,
        discountAmount: verifiedDiscount,
        currency: appliedCoupon.currency || "USD",
      });
    }

    // 6. Update inventory levels and audit log
    for (const item of verifiedItems) {
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod && typeof prod.stock === "number") {
        const prevStock = prod.stock;
        prod.stock = Math.max(0, prod.stock - item.quantity);
        db.inventoryHistory.unshift({
          id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: prod.id,
          productName: prod.name,
          previousStock: prevStock,
          newStock: prod.stock,
          adjustment: -item.quantity,
          reason: `Customer Order Placement: ${confirmedOrder.id}`,
          timestamp: confirmedOrder.createdAt,
          adminEmail: "system@velore.com",
        });
      }
    }

    // 7. Update customer profile & spend aggregation
    const customerEmailLower = confirmedOrder.customer.email.toLowerCase();
    let customer = db.customers.find((c) => c.email.toLowerCase() === customerEmailLower);

    if (customer) {
      customer.ordersCount += 1;
      customer.totalSpend = Math.round((customer.totalSpend + confirmedOrder.total) * 100) / 100;
      if (customer.totalSpend >= 2000) {
        customer.tier = "Black Card";
      } else if (customer.totalSpend >= 750) {
        customer.tier = "VIP Connoisseur";
      }
    } else {
      const newCust: CustomerRecord = {
        id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `${confirmedOrder.customer.firstName} ${confirmedOrder.customer.lastName}`.trim(),
        email: confirmedOrder.customer.email,
        phone: confirmedOrder.customer.phone,
        registrationDate: confirmedOrder.createdAt,
        ordersCount: 1,
        totalSpend: confirmedOrder.total,
        tier: confirmedOrder.total >= 750 ? "VIP Connoisseur" : "Silver Member",
      };
      db.customers.unshift(newCust);
    }

    saveStoreDb(db);

    return NextResponse.json({ success: true, order: confirmedOrder }, { status: 201 });
  } catch (error) {
    console.error("[API] Order placement failure:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process and record order." },
      { status: 500 }
    );
  }
}
