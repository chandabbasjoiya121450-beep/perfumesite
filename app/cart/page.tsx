"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/utils";
import { PRODUCTS, Product } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoName, setPromoName] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [giftNoteOpen, setGiftNoteOpen] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const freeShippingThreshold = 150;
  const shipping = cartSubtotal >= freeShippingThreshold ? 0 : 15;
  const total = Math.max(0, cartSubtotal - promoDiscount + (cartCount > 0 ? shipping : 0));

  const validateCartCoupon = async (codeToTest: string) => {
    if (!codeToTest.trim()) {
      setPromoMessage({ type: "error", text: "Please enter a promotional code." });
      return;
    }

    setPromoLoading(true);
    setPromoMessage(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToTest.trim(),
          items: cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setPromoDiscount(data.discountAmount);
        setPromoApplied(true);
        setPromoName(data.coupon.name);
        setPromoMessage({
          type: "success",
          text: `${data.coupon.name} applied successfully.`,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("velore_applied_coupon", codeToTest.trim().toUpperCase());
        }
      } else {
        setPromoDiscount(0);
        setPromoApplied(false);
        setPromoName("");
        setPromoMessage({
          type: "error",
          text: data.error || "The promotional code entered is not valid.",
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("velore_applied_coupon");
        }
      }
    } catch (e) {
      setPromoMessage({ type: "error", text: "Failed to validate promotion." });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    validateCartCoupon(promoCode);
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoName("");
    setPromoMessage(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("velore_applied_coupon");
    }
  };

  // Revalidate coupon if cart items change and coupon was applied
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("velore_applied_coupon") : null;
    if (saved && cart.length > 0 && !promoApplied) {
      setPromoCode(saved);
      validateCartCoupon(saved);
    }
  }, [cartSubtotal]);

  const handleMoveToWishlist = (product: Product, cartItemId: string) => {
    if (!isInWishlist(product.id)) {
      toggleWishlist(product.id);
    }
    removeFromCart(cartItemId);
  };

  // Cross sell suggestions: perfumes not currently in the cart
  const cartProductIds = cart.map((item) => item.product.id);
  const crossSellProducts = PRODUCTS.filter((p) => !cartProductIds.includes(p.id)).slice(0, 4);

  return (
    <StoreLayout>
      <div className="py-10 sm:py-14 md:py-18">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-xs text-muted-taupe uppercase tracking-wider">
              <li>
                <Link href="/" className="hover:text-charcoal transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-soft-stone">/</li>
              <li className="text-charcoal font-medium" aria-current="page">
                Shopping Bag
              </li>
            </ol>
          </nav>

          <SectionHeading
            eyebrow="Curated Selection"
            title="Your Shopping Bag"
            description="Review your chosen olfactory formulations before proceeding to complimentary artisan dispatch."
            align="center"
            className="mb-10"
          />

          {cartCount > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Cart Items */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-soft-stone text-xs uppercase tracking-wider text-muted-taupe">
                  <span>Product Details</span>
                  <span className="hidden sm:inline">Quantity &amp; Subtotal</span>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 bg-pure-white rounded-card border border-soft-stone shadow-subtle flex flex-col sm:flex-row items-center gap-6"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-24 h-32 sm:w-28 sm:h-36 rounded bg-soft-stone/30 overflow-hidden shrink-0 group"
                    >
                      <Image
                        src={item.product.images?.[0] || item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 96px, 112px"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-[10px] uppercase tracking-widest text-champagne font-medium block">
                        {item.product.family} &bull; {item.product.intensity || "Extrait de Parfum"}
                      </span>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-serif text-xl sm:text-2xl text-charcoal hover:text-champagne transition-colors mt-0.5 block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-taupe mt-1">
                        Size: <span className="text-charcoal font-medium">{item.size || item.product.size}</span>
                      </p>
                      <p className="text-[11px] text-muted-taupe mt-0.5 line-clamp-1">
                        Notes: {item.product.topNotes.slice(0, 2).join(", ")} &bull; {item.product.heartNotes.slice(0, 1).join("")}
                      </p>
                      <span className="block mt-2 font-medium text-charcoal text-sm">
                        {formatCurrency(item.product.price)} each
                      </span>

                      {/* Item-level actions */}
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 pt-3 border-t border-soft-stone/60 text-xs">
                        <button
                          type="button"
                          onClick={() => handleMoveToWishlist(item.product, item.id)}
                          className="text-muted-taupe hover:text-champagne uppercase tracking-wider text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>Save to Wishlist</span>
                        </button>
                        <span className="text-soft-stone">&bull;</span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-taupe hover:text-red-600 uppercase tracking-wider text-[11px] transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity Stepper & Line Price */}
                    <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
                      <div className="inline-flex items-center border border-soft-stone bg-warm-ivory rounded-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-soft-stone/50 transition-colors text-xs"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-soft-stone/50 transition-colors text-xs"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif text-lg font-semibold text-charcoal">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping Button */}
                <div className="pt-4 flex items-center justify-between">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal hover:text-champagne transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Continue Exploring Fragrances</span>
                  </Link>

                  <span className="text-xs text-muted-taupe">
                    {cartCount} {cartCount === 1 ? "creation" : "creations"} in your bag
                  </span>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-pure-white rounded-card p-6 sm:p-8 border border-soft-stone shadow-card sticky top-28 space-y-6">
                  <h3 className="text-xs uppercase font-semibold tracking-widest text-charcoal pb-4 border-b border-soft-stone">
                    Order Summary
                  </h3>

                  {/* Calculations */}
                  <div className="space-y-3 text-sm text-muted-taupe">
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span className="font-serif text-charcoal font-medium">{formatCurrency(cartSubtotal)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Artisan Delivery</span>
                      <span className="uppercase text-xs tracking-wider text-charcoal">
                        {shipping === 0 ? "Complimentary" : formatCurrency(shipping)}
                      </span>
                    </div>

                    {shipping === 0 ? (
                      <p className="text-[11px] text-green-800 bg-green-50 px-2 py-1 rounded">
                        ✓ Complimentary express courier shipping unlocked
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-taupe">
                        Add ${freeShippingThreshold - cartSubtotal} more for complimentary delivery.
                      </p>
                    )}

                    {promoApplied && (
                      <div className="flex justify-between items-center text-green-700">
                        <span>Privilege Discount</span>
                        <span>-{formatCurrency(promoDiscount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        disabled={promoApplied || promoLoading}
                        placeholder="Promotional or Gift Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/50 focus:outline-none focus:border-charcoal uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal disabled:opacity-75 font-mono"
                      />
                      {promoApplied ? (
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="px-3 py-2 bg-stone-100 border border-soft-stone text-xs uppercase tracking-wider text-muted-taupe hover:text-red-700 hover:border-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={promoLoading || !promoCode.trim()}
                          className="px-4 py-2 bg-warm-ivory border border-soft-stone text-xs uppercase tracking-wider text-charcoal hover:bg-charcoal hover:text-pure-white transition-colors disabled:opacity-50"
                        >
                          {promoLoading ? "..." : "Apply"}
                        </button>
                      )}
                    </div>

                    {promoMessage && (
                      <div
                        className={`text-[11px] mt-2 p-2 rounded flex items-center justify-between ${
                          promoMessage.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <span>{promoMessage.text}</span>
                        {promoMessage.type === "success" && (
                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            className="text-[10px] uppercase tracking-wider underline hover:text-red-700 ml-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </form>

                  {/* Gift Note Accordion */}
                  <div className="border-t border-soft-stone pt-4">
                    <button
                      type="button"
                      onClick={() => setGiftNoteOpen(!giftNoteOpen)}
                      className="w-full flex items-center justify-between text-xs text-charcoal font-medium uppercase tracking-wider"
                    >
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        <span>Add Complimentary Gift Card</span>
                      </span>
                      <span>{giftNoteOpen ? "−" : "+"}</span>
                    </button>

                    {giftNoteOpen && (
                      <div className="mt-3">
                        <textarea
                          rows={3}
                          value={giftNote}
                          onChange={(e) => setGiftNote(e.target.value)}
                          placeholder="Compose your bespoke greeting. We transcribe this on handmade cotton parchment..."
                          className="w-full p-2.5 text-xs border border-soft-stone bg-warm-ivory/40 rounded-sm focus:outline-none focus:border-charcoal text-charcoal resize-none placeholder:text-muted-taupe/70"
                        />
                      </div>
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className="pt-4 border-t border-soft-stone flex justify-between items-baseline">
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-charcoal font-semibold">
                        Estimated Total
                      </span>
                      <span className="block text-[11px] text-muted-taupe">Taxes calculated during checkout</span>
                    </div>
                    <span className="font-serif text-2xl font-semibold text-charcoal">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {/* Checkout CTA */}
                  <div>
                    <Link
                      href="/checkout"
                      className="w-full py-4 px-6 bg-charcoal text-pure-white text-xs font-medium uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-all duration-300 block text-center shadow-md"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>

                  {/* High Luxury Trust Guarantee */}
                  <div className="text-[11px] text-muted-taupe pt-2 space-y-2 border-t border-soft-stone">
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-champagne shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>100% Authentic Haute Parfumerie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-champagne shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Complimentary returns within 30 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-champagne shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Climate-neutral insured transit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center max-w-lg mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-soft-stone/40 border border-soft-stone mx-auto flex items-center justify-center text-muted-taupe">
                <svg className="w-9 h-9 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-3xl text-charcoal mb-2">Your Shopping Bag Is Empty</h3>
                <p className="text-sm text-muted-taupe leading-relaxed">
                  Your cart currently holds no artisan compositions. Discover our rare botanical formulations or take our fragrance consultation quiz.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors"
                >
                  Explore Fragrances
                </Link>
                <Link
                  href="/fragrance-finder"
                  className="w-full sm:w-auto px-8 py-3.5 bg-pure-white border border-soft-stone text-charcoal text-xs uppercase tracking-widest hover:border-charcoal transition-colors"
                >
                  Find Signature Scent
                </Link>
              </div>
            </div>
          )}

          {/* Cross-Sell Recommendations */}
          {crossSellProducts.length > 0 && (
            <div className="mt-20 pt-16 border-t border-soft-stone">
              <div className="text-center mb-10">
                <span className="text-xs uppercase tracking-widest text-champagne font-medium block mb-1">
                  Private Reserve
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
                  You May Also Admire
                </h3>
                <p className="text-xs text-muted-taupe mt-1">
                  Complimentary artisan formulations chosen to enrich your personal collection.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {crossSellProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </StoreLayout>
  );
}
