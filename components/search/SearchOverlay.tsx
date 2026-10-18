"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { getLiveSearchSuggestions } from "@/lib/search";
import { formatCurrency } from "@/lib/utils";

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input whenever overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      setQuery("");
      setSelectedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSearchOpen]);

  // Handle global Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  const suggestions = getLiveSearchSuggestions(query, 5, 3);
  const totalItems =
    suggestions.products.length +
    suggestions.collections.length +
    (suggestions.totalProductMatches > 0 ? 1 : 0);

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex === -1) {
        // Direct search submit
        if (query.trim()) {
          closeSearch();
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
      } else if (selectedIndex < suggestions.products.length) {
        // Product item selected
        const prod = suggestions.products[selectedIndex];
        closeSearch();
        router.push(`/products/${prod.slug}`);
      } else if (
        selectedIndex <
        suggestions.products.length + suggestions.collections.length
      ) {
        // Collection item selected
        const colIndex = selectedIndex - suggestions.products.length;
        const col = suggestions.collections[colIndex];
        closeSearch();
        router.push(`/collections/${col.slug}`);
      } else {
        // "View All" link
        closeSearch();
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const popularSearches = [
    { label: "Woody", query: "woody" },
    { label: "Turkish Rose", query: "rose" },
    { label: "Oud Royale", query: "oud" },
    { label: "Bourbon Amber", query: "amber" },
    { label: "Bergamot", query: "bergamot" },
    { label: "Discovery Coffret", query: "discovery" },
  ];

  if (!isSearchOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Fragrances"
      className="fixed inset-0 z-50 flex flex-col bg-charcoal/80 backdrop-blur-md animate-fade-in"
      onClick={closeSearch}
    >
      <div
        className="w-full bg-warm-ivory border-b border-soft-stone shadow-modal p-4 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header Bar: Brand Wordmark + Close Button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-soft-stone">
            <span className="font-serif text-2xl font-medium tracking-wordmark text-charcoal">
              VELORÉ
            </span>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search overlay (Esc)"
              className="p-2 text-muted-taupe hover:text-charcoal rounded-full hover:bg-soft-stone/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center mb-6">
            <svg
              className="absolute left-4 w-5 h-5 text-muted-taupe pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search fragrances, botanical notes (Oud, Rose, Santal, Amber...)"
              aria-autocomplete="list"
              aria-controls="search-suggestions-list"
              className="w-full h-14 pl-12 pr-12 text-base sm:text-lg bg-pure-white border border-soft-stone rounded-input text-charcoal placeholder:text-muted-taupe/70 shadow-subtle focus:border-charcoal focus:ring-1 focus:ring-champagne focus:outline-none transition-colors"
            />

            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search input"
                className="absolute right-4 p-1 text-muted-taupe hover:text-charcoal transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Content Area */}
          {!query.trim() ? (
            /* Popular Suggested Searches */
            <div className="py-4">
              <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-medium block mb-3">
                Curated Suggestions
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item) => (
                  <button
                    key={item.query}
                    type="button"
                    onClick={() => {
                      setQuery(item.query);
                      inputRef.current?.focus();
                    }}
                    className="px-3.5 py-1.5 rounded-pill bg-pure-white border border-soft-stone text-xs text-charcoal hover:border-champagne hover:text-champagne-dark transition-colors shadow-subtle"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : suggestions.totalProductMatches === 0 &&
            suggestions.collections.length === 0 ? (
            /* No Results Found State */
            <div className="py-12 text-center">
              <span className="font-serif text-3xl text-charcoal block mb-2">✦</span>
              <h3 className="font-serif text-xl text-charcoal mb-1">
                No Fragrances Found
              </h3>
              <p className="text-xs text-muted-taupe max-w-sm mx-auto">
                No catalog entries match &ldquo;{query}&rdquo;. Try searching for notes
                like Bergamot, Oud, Sandalwood, or Rose.
              </p>
            </div>
          ) : (
            /* Suggestions List */
            <div id="search-suggestions-list" className="space-y-6">
              {/* Matching Fragrance Collections */}
              {suggestions.collections.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-semibold block mb-2.5">
                    Matching Collections
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {suggestions.collections.map((col, idx) => {
                      const itemIndex = suggestions.products.length + idx;
                      const isHighlighted = selectedIndex === itemIndex;

                      return (
                        <Link
                          key={col.id}
                          href={`/collections/${col.slug}`}
                          onClick={closeSearch}
                          className={`flex items-center gap-3 p-3 rounded-card border transition-all ${
                            isHighlighted
                              ? "bg-warm-ivory border-champagne ring-1 ring-champagne"
                              : "bg-pure-white border-soft-stone hover:border-champagne/60 shadow-subtle"
                          }`}
                        >
                          <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-soft-stone flex-shrink-0">
                            <Image
                              src={col.heroImage || col.image}
                              alt={col.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-serif text-sm font-medium text-charcoal block truncate">
                              {col.title}
                            </span>
                            <span className="text-[10px] text-muted-taupe uppercase tracking-wider block">
                              View Collection →
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matching Perfume Products */}
              {suggestions.products.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-semibold block mb-2.5">
                    Matching Fragrances ({suggestions.totalProductMatches})
                  </span>
                  <div className="space-y-2">
                    {suggestions.products.map((product, idx) => {
                      const isHighlighted = selectedIndex === idx;

                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={closeSearch}
                          className={`flex items-center justify-between p-3 rounded-card border transition-all ${
                            isHighlighted
                              ? "bg-warm-ivory border-champagne ring-1 ring-champagne"
                              : "bg-pure-white border-soft-stone hover:border-champagne/60 shadow-subtle"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative w-12 h-14 rounded-image overflow-hidden bg-soft-stone flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-serif text-base text-charcoal font-medium truncate">
                                  {product.name}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-champagne-dark font-medium">
                                  {product.family}
                                </span>
                              </div>
                              <p className="text-xs text-muted-taupe truncate">
                                {product.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 ml-4">
                            <span className="font-serif text-sm text-charcoal font-medium">
                              {formatCurrency(product.price)}
                            </span>
                            <span className="block text-[10px] text-muted-taupe uppercase tracking-wider">
                              {product.size}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View All Matching Results CTA */}
              <div className="pt-2 border-t border-soft-stone flex items-center justify-between">
                <span className="text-xs text-muted-taupe">
                  Use ↑ and ↓ arrows to navigate, Enter to select
                </span>
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={closeSearch}
                  className={`text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-btn transition-colors ${
                    selectedIndex === totalItems - 1
                      ? "bg-charcoal text-warm-ivory"
                      : "text-charcoal hover:text-champagne-dark"
                  }`}
                >
                  View All {suggestions.totalProductMatches} Results →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
