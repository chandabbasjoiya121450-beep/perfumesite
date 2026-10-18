"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function QuickViewModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset quantity and image error whenever quickViewProduct changes
  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setAddedSuccess(false);
      setImageError(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [quickViewProduct]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!quickViewProduct) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeQuickView();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickViewProduct, closeQuickView]);

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    if (!quickViewProduct.isAvailable) return;
    addToCart(quickViewProduct, quickViewProduct.size, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-xs p-4 sm:p-6 animate-fade-in"
      onClick={closeQuickView}
    >
      <div
        className="relative bg-pure-white rounded-card border border-soft-stone shadow-modal max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close quick view dialog (Esc)"
          className="absolute top-4 right-4 z-20 p-2 text-muted-taupe hover:text-charcoal bg-pure-white/80 backdrop-blur-xs rounded-full border border-soft-stone shadow-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: Image Container (4:5 ratio) */}
        <div className="relative aspect-[4/5] md:w-1/2 w-full bg-soft-stone/20 overflow-hidden flex-shrink-0">
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-soft-stone/30">
              <span className="font-serif text-2xl text-charcoal mb-1">VELORÉ</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe">
                Haute Parfumerie
              </span>
            </div>
          ) : (
            <Image
              src={quickViewProduct.image}
              alt={quickViewProduct.imageAlt || quickViewProduct.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              onError={() => setImageError(true)}
              className="object-cover object-center"
            />
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
            {quickViewProduct.isNewArrival && (
              <Badge variant="dark" size="sm">New Arrival</Badge>
            )}
            {quickViewProduct.isBestSeller && !quickViewProduct.isNewArrival && (
              <Badge variant="accent" size="sm">Best Seller</Badge>
            )}
          </div>
        </div>

        {/* Right Column: Product Details & Controls */}
        <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-taupe mb-1.5">
              <span className="uppercase tracking-widest text-[10px] text-champagne-dark font-medium">
                {quickViewProduct.family} Family
              </span>
              <span>{quickViewProduct.size}</span>
            </div>

            <h2
              id="quick-view-title"
              className="font-serif text-2xl sm:text-3xl text-charcoal font-normal"
            >
              {quickViewProduct.name}
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-muted-taupe font-sans leading-relaxed">
              {quickViewProduct.subtitle}
            </p>

            <div className="mt-4 flex items-baseline gap-2 pb-4 border-b border-soft-stone">
              <span className="text-xl sm:text-2xl font-serif text-charcoal font-medium">
                {formatCurrency(quickViewProduct.price)}
              </span>
              <span className="text-xs text-muted-taupe uppercase tracking-wider">
                {quickViewProduct.currency}
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-charcoal/80 line-clamp-3 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Notes Highlights */}
            <div className="mt-4 pt-3 border-t border-soft-stone/60 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block mb-1">
                Prominent Notes
              </span>
              <p className="text-charcoal font-medium">
                {[...quickViewProduct.topNotes, ...quickViewProduct.heartNotes]
                  .slice(0, 4)
                  .join(" · ")}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="mt-6 pt-5 border-t border-soft-stone space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-soft-stone rounded-btn bg-pure-white shadow-subtle overflow-hidden h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  className="w-8 h-full flex items-center justify-center text-charcoal hover:bg-soft-stone/30 disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-semibold text-charcoal">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                  aria-label="Increase quantity"
                  disabled={quantity >= 5}
                  className="w-8 h-full flex items-center justify-center text-charcoal hover:bg-soft-stone/30 disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!quickViewProduct.isAvailable}
                className={`flex-1 h-11 px-4 rounded-btn text-xs uppercase tracking-wider font-medium transition-all shadow-subtle flex items-center justify-center gap-1.5 ${
                  addedSuccess
                    ? "bg-emerald-950 text-emerald-100"
                    : "bg-charcoal text-warm-ivory hover:bg-charcoal-hover"
                }`}
              >
                {addedSuccess ? (
                  <span>Added to Bag</span>
                ) : quickViewProduct.isAvailable ? (
                  <span>Add · {formatCurrency(quickViewProduct.price * quantity)}</span>
                ) : (
                  <span>Unavailable</span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`w-11 h-11 rounded-btn border flex items-center justify-center transition-colors shadow-subtle ${
                  isWishlisted
                    ? "bg-warm-ivory border-champagne text-champagne-dark"
                    : "bg-pure-white border-soft-stone text-charcoal hover:border-champagne"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isWishlisted ? "#B69B72" : "none"}
                  stroke={isWishlisted ? "#B69B72" : "currentColor"}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* View Full Product Details Link */}
            <div className="text-center pt-2">
              <Link
                href={`/products/${quickViewProduct.slug}`}
                onClick={closeQuickView}
                className="text-xs uppercase tracking-wider text-charcoal font-semibold hover:text-champagne-dark transition-colors inline-flex items-center gap-1"
              >
                <span>View Full Fragrance Story</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
