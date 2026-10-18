"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { Badge } from "@/components/ui/Badge";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < 5) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (!product.isAvailable) return;
    setIsAdding(true);
    addToCart(product, product.size, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2400);
    }, 300);
  };

  return (
    <div className="flex flex-col">
      {/* 1. Category Eyebrow & Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Link
          href={`/collections/${product.fragranceFamily}`}
          className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
        >
          <span className="text-[11px] uppercase tracking-widest text-champagne-dark font-medium">
            {product.family} Collection
          </span>
        </Link>
        {product.isNewArrival && (
          <Badge variant="dark" size="sm">
            New Arrival
          </Badge>
        )}
        {product.isBestSeller && !product.isNewArrival && (
          <Badge variant="accent" size="sm">
            Connoisseur Favorite
          </Badge>
        )}
        {product.isGift && (
          <Badge variant="subtle" size="sm">
            Artisan Gift Box
          </Badge>
        )}
      </div>

      {/* 2. Product Name */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal tracking-tight leading-tight">
        {product.name}
      </h1>

      {/* 3. Fragrance Subtitle Descriptor */}
      <p className="mt-2 text-sm sm:text-base text-muted-taupe font-sans leading-relaxed">
        {product.subtitle}
      </p>

      {/* 4. Price and Genuine Compare-At Price */}
      <div className="mt-5 flex items-baseline gap-3 pb-6 border-b border-soft-stone">
        <span className="text-2xl sm:text-3xl font-serif text-charcoal font-medium">
          {formatCurrency(product.price)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="text-base text-muted-taupe line-through font-sans">
            {formatCurrency(product.compareAtPrice)}
          </span>
        )}
        <span className="text-xs text-muted-taupe uppercase tracking-wider font-sans ml-1">
          {product.currency} · Tax included
        </span>
      </div>

      {/* 5. Bottle Size & Concentration Specification */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-taupe mb-2">
          <span className="uppercase tracking-wider font-medium text-charcoal">
            Bottle Size & Concentration
          </span>
          <span>{product.sizeMl} ml</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-pure-white border border-champagne/60 rounded-btn text-xs font-medium text-charcoal shadow-subtle">
          <span className="w-2 h-2 rounded-full bg-champagne" />
          <span>{product.size}</span>
          {product.intensity && (
            <span className="text-muted-taupe font-normal">
              · {product.intensity}
            </span>
          )}
        </div>
      </div>

      {/* 6. Availability Status */}
      <div className="mt-6 flex items-center gap-2 text-xs">
        {product.isAvailable ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
            <span className="text-emerald-900 font-medium font-sans">
              In Stock · Dispatched within 24 hours from Paris Atelier
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <span className="text-muted-taupe font-medium font-sans">
              Currently Reserved · Join the waitlist
            </span>
          </>
        )}
      </div>

      {/* 7. Concise Editorial Description */}
      <div className="mt-6 text-sm text-charcoal/85 leading-relaxed font-sans">
        <p>{product.description}</p>
      </div>

      {/* 8. Purchase Controls: Quantity Selector + Add to Cart + Wishlist */}
      <div className="mt-8 pt-6 border-t border-soft-stone space-y-4">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-soft-stone rounded-btn bg-pure-white shadow-subtle overflow-hidden h-12">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1 || !product.isAvailable}
              aria-label="Decrease quantity"
              className="w-10 h-full flex items-center justify-center text-charcoal hover:bg-soft-stone/30 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-base font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
            >
              −
            </button>
            <span
              role="status"
              aria-live="polite"
              className="w-10 text-center text-xs font-semibold text-charcoal select-none"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= 5 || !product.isAvailable}
              aria-label="Increase quantity"
              className="w-10 h-full flex items-center justify-center text-charcoal hover:bg-soft-stone/30 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-base font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
            >
              +
            </button>
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.isAvailable || isAdding}
            className={`flex-1 h-12 px-6 rounded-btn text-xs uppercase tracking-widest font-medium transition-all shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne flex items-center justify-center gap-2 ${
              addedSuccess
                ? "bg-emerald-950 text-emerald-100"
                : "bg-charcoal text-warm-ivory hover:bg-charcoal-hover active:scale-[0.99]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isAdding ? (
              <span className="inline-block w-4 h-4 rounded-full border-2 border-warm-ivory border-t-transparent animate-spin" />
            ) : addedSuccess ? (
              <>
                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Added to Bag</span>
              </>
            ) : product.isAvailable ? (
              <span>Add to Shopping Bag · {formatCurrency(product.price * quantity)}</span>
            ) : (
              <span>Unavailable</span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            className={`w-12 h-12 rounded-btn border flex items-center justify-center transition-all shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
              isWishlisted
                ? "bg-warm-ivory border-champagne text-champagne-dark"
                : "bg-pure-white border-soft-stone text-charcoal hover:border-champagne hover:text-champagne-dark"
            }`}
          >
            <svg
              className="w-5 h-5 transition-transform active:scale-125"
              fill={isWishlisted ? "#B69B72" : "none"}
              stroke={isWishlisted ? "#B69B72" : "currentColor"}
              viewBox="0 0 24 24"
              aria-hidden="true"
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
      </div>

      {/* 9. Delivery, Shipping, and Returns Information */}
      <div className="mt-8 pt-6 border-t border-soft-stone space-y-3.5 text-xs text-muted-taupe">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-champagne-dark flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <div>
            <span className="font-medium text-charcoal">Artisan Gift Presentation: </span>
            <span>Housed in our signature rigid coffret with 2 complimentary 2ml sample vials.</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-champagne-dark flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-medium text-charcoal">Complimentary Express Shipping: </span>
            <span>Dispatched within 24 hours. Learn more on our{" "}
              <Link href="/shipping" className="text-charcoal underline hover:text-champagne-dark">
                Shipping & Delivery
              </Link>{" "}
              page.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-champagne-dark flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-medium text-charcoal">Risk-Free Olfactory Trial: </span>
            <span>Test the included 2ml sample before opening the full flacon. Read our{" "}
              <Link href="/faqs" className="text-charcoal underline hover:text-champagne-dark">
                FAQs & Returns
              </Link>{" "}
              policy.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
