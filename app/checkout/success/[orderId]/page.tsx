"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/lib/utils";
import { Order, getOrderById } from "@/lib/data/orders";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) {
        setOrder(found);
      }
    }
  }, [orderId]);

  return (
    <StoreLayout>
      <div className="py-12 sm:py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Confirmation Banner */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-champagne/15 border border-champagne text-champagne mx-auto flex items-center justify-center shadow-subtle">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="inline-block px-3.5 py-1 rounded-full bg-warm-ivory border border-soft-stone text-xs uppercase tracking-widest text-champagne font-medium">
                Order Received &bull; {order ? order.id : orderId}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">
                Thank You for Your Patronage
              </h1>

              <p className="text-sm sm:text-base text-muted-taupe max-w-lg mx-auto leading-relaxed">
                Your order is being hand-bottled and prepared for white-glove dispatch. A confirmation notice has been dispatched to{" "}
                <strong className="text-charcoal font-medium">
                  {order?.customer.email || "your email address"}
                </strong>
                .
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-10 shadow-subtle space-y-8">
              {/* Order Meta Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-soft-stone text-xs">
                <div>
                  <span className="block text-muted-taupe uppercase tracking-wider text-[10px]">
                    Order Number
                  </span>
                  <span className="block font-medium text-charcoal font-mono mt-0.5">
                    {order?.id || orderId}
                  </span>
                </div>
                <div>
                  <span className="block text-muted-taupe uppercase tracking-wider text-[10px]">
                    Dispatch Status
                  </span>
                  <span className="block font-medium text-green-700 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {order?.status || "Preparing Dispatch"}
                  </span>
                </div>
                <div>
                  <span className="block text-muted-taupe uppercase tracking-wider text-[10px]">
                    Delivery Method
                  </span>
                  <span className="block font-medium text-charcoal mt-0.5">
                    {order?.shippingMethod.name || "White-Glove Courier"}
                  </span>
                </div>
                <div>
                  <span className="block text-muted-taupe uppercase tracking-wider text-[10px]">
                    Estimated Arrival
                  </span>
                  <span className="block font-medium text-charcoal mt-0.5">
                    {order?.shippingMethod.estimatedDelivery || "3–5 business days"}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold text-charcoal mb-4">
                  Artisan Formulations Ordered
                </h3>

                <div className="space-y-4">
                  {order?.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 py-3 border-b border-soft-stone/60 last:border-0"
                      >
                        <div className="relative w-16 h-20 rounded bg-soft-stone/30 overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-serif text-lg text-charcoal hover:text-champagne transition-colors font-medium truncate block"
                          >
                            {item.name}
                          </Link>
                          <span className="text-xs text-muted-taupe block">
                            {item.size} &bull; Quantity: {item.quantity}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-sm font-semibold text-charcoal">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-xs text-muted-taupe">
                      Order details successfully archived in your VELORÉ Client Account.
                    </div>
                  )}
                </div>
              </div>

              {/* Complimentary Samples */}
              {order?.samples && order.samples.length > 0 && (
                <div className="bg-warm-ivory p-4 rounded-sm border border-soft-stone text-xs space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-champagne block">
                    Complimentary Discovery Coffret Included
                  </span>
                  <div className="flex flex-wrap gap-2 text-charcoal font-medium">
                    {order.samples.map((s, idx) => (
                      <span key={idx} className="bg-pure-white px-2.5 py-1 rounded border border-soft-stone/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Destination & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-soft-stone text-xs">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold mb-2">
                    Shipping Destination
                  </h4>
                  {order ? (
                    <div className="text-charcoal leading-relaxed">
                      <p className="font-medium">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p>{order.shippingAddress.street}</p>
                      {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      <p className="mt-1 text-muted-taupe">{order.customer.phone}</p>
                    </div>
                  ) : (
                    <p className="text-muted-taupe">Recipient destination on file.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold mb-2">
                    Payment Method
                  </h4>
                  <p className="text-charcoal font-medium">
                    {order?.paymentMethod || "Demo Mode Transaction"}
                  </p>
                  <p className="text-muted-taupe text-[11px] mt-1">
                    Demonstration order &bull; Paid in full
                  </p>

                  {/* Financial Breakdown */}
                  {order && (
                    <div className="mt-4 pt-3 border-t border-soft-stone/80 space-y-1.5 text-xs">
                      <div className="flex justify-between text-muted-taupe">
                        <span>Subtotal</span>
                        <span className="text-charcoal">{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-muted-taupe">
                        <span>Artisan Delivery</span>
                        <span className="text-charcoal">
                          {order.shipping === 0 ? "Complimentary" : formatCurrency(order.shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-taupe">
                        <span>Estimated Tax</span>
                        <span className="text-charcoal">{formatCurrency(order.tax)}</span>
                      </div>
                      <div className="flex justify-between text-charcoal font-medium pt-2 border-t border-soft-stone/60">
                        <span>Total Paid</span>
                        <span className="font-serif text-sm font-semibold">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/account"
                className="w-full sm:w-auto px-8 py-3.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors text-center font-medium shadow-sm"
              >
                View in Client Account
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 bg-pure-white border border-soft-stone text-charcoal text-xs uppercase tracking-widest hover:border-charcoal transition-colors text-center"
              >
                Continue Exploring
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </StoreLayout>
  );
}
