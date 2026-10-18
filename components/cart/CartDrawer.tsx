"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
  } = useStore();

  const drawerRef = useRef<HTMLDivElement>(null);
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-warm-ivory border-l border-soft-stone shadow-modal flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-soft-stone/80 bg-pure-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                Shopping Bag
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-muted-taupe">
                ({cartCount} {cartCount === 1 ? "item" : "items"})
              </span>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-charcoal/70 hover:text-charcoal hover:bg-soft-stone/40 rounded-full transition-colors"
              aria-label="Close bag drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          {cart.length > 0 && (
            <div className="bg-warm-ivory px-6 py-3.5 border-b border-soft-stone">
              <div className="flex items-center justify-between text-xs mb-1.5">
                {cartSubtotal >= freeShippingThreshold ? (
                  <span className="text-charcoal font-medium flex items-center gap-1.5 text-xs">
                    <svg className="w-4 h-4 text-champagne shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Complimentary express delivery unlocked!</span>
                  </span>
                ) : (
                  <span className="text-muted-taupe text-xs">
                    Add <strong className="text-charcoal">${remainingForFreeShipping.toFixed(0)}</strong> more for complimentary delivery
                  </span>
                )}
                <span className="text-[10px] text-muted-taupe uppercase tracking-wider">
                  {cartSubtotal >= freeShippingThreshold ? "100%" : `${Math.round(progressToFreeShipping)}%`}
                </span>
              </div>
              <div className="w-full bg-soft-stone h-1 rounded-full overflow-hidden">
                <div
                  className="bg-champagne h-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Drawer Body (Items or Empty State) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-soft-stone/40 border border-soft-stone flex items-center justify-center text-muted-taupe">
                  <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-charcoal mb-1">Your bag is empty</h3>
                  <p className="text-xs text-muted-taupe max-w-xs leading-relaxed">
                    Explore our private reserve of artisan extraits and rare botanical fragrances.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center justify-center px-6 py-3 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors duration-300"
                >
                  Explore Fragrances
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-pure-white p-4 rounded-card border border-soft-stone flex gap-4 transition-all duration-200 hover:border-soft-stone/80 shadow-subtle"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    onClick={closeCart}
                    className="relative w-20 h-24 rounded bg-soft-stone/30 overflow-hidden shrink-0 group"
                  >
                    <Image
                      src={item.product.images[0] || item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="80px"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="font-serif text-base text-charcoal hover:text-champagne transition-colors font-medium leading-tight"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-taupe/60 hover:text-red-700 p-0.5 transition-colors"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <span className="text-[11px] text-muted-taupe block mt-0.5">
                        {item.size || item.product.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-soft-stone bg-warm-ivory rounded-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-soft-stone/50 transition-colors text-xs"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-medium text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-soft-stone/50 transition-colors text-xs"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="font-serif text-sm font-medium text-charcoal">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-pure-white border-t border-soft-stone space-y-4">
              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-muted-taupe">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-serif text-base font-semibold">
                    ${cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-taupe">
                  <span>Estimated Shipping</span>
                  <span className="text-charcoal uppercase tracking-wider text-[11px]">
                    {cartSubtotal >= freeShippingThreshold ? "Complimentary" : "$15.00"}
                  </span>
                </div>
              </div>

              {/* Luxury Guarantee */}
              <div className="text-[11px] text-muted-taupe bg-warm-ivory p-3 rounded-sm border border-soft-stone flex items-center gap-2">
                <svg className="w-4 h-4 text-champagne shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>Includes signature presentation coffret &amp; two complimentary sample vials.</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3.5 px-6 bg-charcoal text-pure-white text-xs font-medium uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-all duration-300 block text-center shadow-sm"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-2.5 px-6 bg-pure-white border border-soft-stone text-charcoal text-xs font-medium uppercase tracking-widest hover:border-charcoal transition-colors block text-center"
                >
                  View Full Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
