"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS, Product } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const { wishlist, wishlistCount, toggleWishlist, addToCart } = useStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // Sort items
  const sortedProducts = [...wishlistedProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const handleAddAllToBag = () => {
    wishlistedProducts.forEach((p) => {
      addToCart(p, 1);
    });
    setAddedIds(wishlistedProducts.map((p) => p.id));
    setTimeout(() => setAddedIds([]), 3000);
  };

  const handleAddSingleToBag = (product: Product) => {
    addToCart(product, 1);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 2500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Curated recommendations if wishlist has few or no items
  const recommendations = PRODUCTS.filter((p) => !wishlist.includes(p.id)).slice(0, 4);

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
                Curated Wishlist
              </li>
            </ol>
          </nav>

          <SectionHeading
            eyebrow="Personal Curation"
            title="Your Curated Wishlist"
            description="Your selected olfactory favorites, preserved for your next order or bespoke consultation."
            align="center"
            className="mb-8"
          />

          {wishlistCount > 0 ? (
            <div className="space-y-8">
              {/* Wishlist Controls Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-pure-white rounded-card border border-soft-stone shadow-subtle">
                <div className="text-xs text-muted-taupe">
                  Showing <strong className="text-charcoal">{wishlistCount}</strong> saved{" "}
                  {wishlistCount === 1 ? "fragrance" : "fragrances"}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
                  {/* Sort control */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs bg-warm-ivory border border-soft-stone px-3 py-2 rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
                    aria-label="Sort wishlist items"
                  >
                    <option value="default">Default Order</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>

                  {/* Share button */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-warm-ivory border border-soft-stone text-charcoal text-xs uppercase tracking-wider hover:border-champagne transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>{copiedLink ? "Link Copied!" : "Share"}</span>
                  </button>

                  {/* Add All to Bag */}
                  <button
                    type="button"
                    onClick={handleAddAllToBag}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors font-medium shadow-sm"
                  >
                    <span>Move All to Bag</span>
                  </button>
                </div>
              </div>

              {/* Wishlist Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {sortedProducts.map((product) => {
                  const isAdded = addedIds.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      className="bg-pure-white border border-soft-stone rounded-card overflow-hidden flex flex-col justify-between shadow-subtle group hover:border-champagne/60 transition-all duration-300"
                    >
                      <div>
                        {/* Image & Badges */}
                        <div className="aspect-[4/5] relative bg-soft-stone/30 overflow-hidden">
                          <Link href={`/products/${product.slug}`}>
                            <Image
                              src={product.images?.[0] || product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          </Link>

                          {/* Family Badge */}
                          <span className="absolute top-3 left-3 bg-warm-ivory/90 backdrop-blur-sm text-charcoal text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-sm border border-soft-stone">
                            {product.family}
                          </span>

                          {/* Remove from Wishlist button */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-pure-white/90 backdrop-blur-sm flex items-center justify-center text-champagne hover:bg-red-50 hover:text-red-600 transition-colors shadow-subtle"
                            aria-label={`Remove ${product.name} from wishlist`}
                            title="Remove from wishlist"
                          >
                            <svg className="w-4 h-4 fill-champagne" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <span className="text-[10px] uppercase tracking-widest text-muted-taupe block mb-1">
                            {product.size}
                          </span>

                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-serif text-lg text-charcoal group-hover:text-champagne transition-colors mb-1 font-medium leading-tight">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-xs text-muted-taupe line-clamp-2 mb-3">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <span className="font-serif text-base font-medium text-charcoal">
                              {formatCurrency(product.price)}
                            </span>
                            <span className="text-[10px] text-green-800 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded">
                              In Stock
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddSingleToBag(product)}
                          className={`py-2.5 px-3 text-[11px] uppercase tracking-wider font-medium transition-colors text-center ${
                            isAdded
                              ? "bg-green-700 text-pure-white"
                              : "bg-charcoal text-pure-white hover:bg-champagne hover:text-charcoal"
                          }`}
                        >
                          {isAdded ? "Added" : "Add to Bag"}
                        </button>

                        <Link
                          href={`/products/${product.slug}`}
                          className="py-2.5 px-3 bg-pure-white border border-soft-stone text-[11px] uppercase tracking-wider text-charcoal hover:border-champagne hover:text-champagne transition-colors text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center max-w-lg mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-soft-stone/40 border border-soft-stone mx-auto flex items-center justify-center text-muted-taupe">
                <svg className="w-9 h-9 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="font-serif text-3xl text-charcoal mb-2">Your Wishlist Is Empty</h3>
                <p className="text-sm text-muted-taupe leading-relaxed">
                  You have not preserved any fragrances in your private wishlist yet. Click the heart icon on any perfume card to curate your personal olfactory collection.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors"
                >
                  Explore Catalog
                </Link>
                <Link
                  href="/fragrance-finder"
                  className="w-full sm:w-auto px-8 py-3.5 bg-pure-white border border-soft-stone text-charcoal text-xs uppercase tracking-widest hover:border-charcoal transition-colors"
                >
                  Fragrance Consultation
                </Link>
              </div>
            </div>
          )}

          {/* Curated Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-20 pt-16 border-t border-soft-stone">
              <div className="text-center mb-10">
                <span className="text-xs uppercase tracking-widest text-champagne font-medium block mb-1">
                  Haute Parfumerie Selections
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
                  Curated Fragrances for You
                </h3>
                <p className="text-xs text-muted-taupe mt-1">
                  Discover masterwork extraits and eau de parfums to inspire your collection.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {recommendations.map((product) => (
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
