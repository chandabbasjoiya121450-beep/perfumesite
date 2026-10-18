"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";
import { ProductImage } from "./ProductImage";
import { Badge } from "./Badge";
import { useStore } from "@/context/StoreContext";

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useStore();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative flex flex-col bg-pure-white rounded-card border border-soft-stone overflow-hidden p-4 sm:p-5 transition-all duration-hover ease-luxury hover:shadow-card hover:border-champagne/40">
      {/* Product Image Container with 4:5 ratio */}
      <div className="relative w-full overflow-hidden rounded-image">
        <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <ProductImage
            src={product.image}
            alt={product.name}
            aspectRatio="4/5"
            priority={priority}
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
          {product.isNewArrival && <Badge variant="dark" size="sm">New Arrival</Badge>}
          {product.isBestSeller && !product.isNewArrival && (
            <Badge variant="accent" size="sm">Best Seller</Badge>
          )}
          {product.isGift && <Badge variant="subtle" size="sm">Gift Coffret</Badge>}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-pure-white/90 backdrop-blur-sm border border-soft-stone flex items-center justify-center text-charcoal hover:text-champagne-dark shadow-subtle transition-all duration-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        >
          <svg
            className="w-4 h-4 transition-colors"
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

        {/* Quick Add and Quick View overlay trigger on hover */}
        <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-hover hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex-1 py-2.5 px-3 bg-charcoal text-warm-ivory text-xs uppercase tracking-wider font-medium rounded-pill shadow-modal hover:bg-charcoal-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne truncate"
          >
            Quick Add · {formatCurrency(product.price)}
          </button>
          <button
            type="button"
            onClick={() => openQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="w-9 h-9 flex-shrink-0 bg-pure-white text-charcoal hover:text-champagne-dark border border-soft-stone rounded-full shadow-modal flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Details Block */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-taupe mb-1">
            <span className="uppercase tracking-wider text-[10px] text-champagne-dark font-medium">
              {product.family}
            </span>
            <span className="text-[11px]">{product.size}</span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="block group-hover:text-champagne-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne rounded-sm"
          >
            <h3 className="font-serif text-base sm:text-lg text-charcoal font-normal leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-muted-taupe line-clamp-1 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Mobile Add to Bag & Quick View Buttons */}
        <div className="mt-3 pt-3 border-t border-soft-stone/70 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-charcoal">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-taupe line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex sm:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => openQuickView(product)}
              className="text-[11px] uppercase tracking-wider text-muted-taupe hover:text-charcoal"
            >
              Quick View
            </button>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="text-xs uppercase tracking-wider font-medium text-champagne-dark hover:underline"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
