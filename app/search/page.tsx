"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShopSortSelector, SortOption } from "@/components/shop";
import { searchProductsEnhanced, searchCollectionsEnhanced } from "@/lib/search";
import { sortProducts, Product, FragranceFamilyDisplay } from "@/lib/data/products";

function SearchInteractive() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("featured");

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  // Synchronize search term back into URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    }
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(target, { scroll: false });
  }, [searchTerm, pathname, router]);

  // 1. Matched Products using accent-normalized search
  const rawMatchedProducts = useMemo(() => {
    return searchProductsEnhanced(searchTerm);
  }, [searchTerm]);

  // 2. Matched Collections
  const matchedCollections = useMemo(() => {
    return searchCollectionsEnhanced(searchTerm);
  }, [searchTerm]);

  // 3. Family Filtering within search results
  const filteredProducts = useMemo(() => {
    if (selectedFamily === "all") return rawMatchedProducts;
    return rawMatchedProducts.filter(
      (p) => p.family.toLowerCase() === selectedFamily.toLowerCase()
    );
  }, [rawMatchedProducts, selectedFamily]);

  // 4. Sorted Products
  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortOption);
  }, [filteredProducts, sortOption]);

  const families: FragranceFamilyDisplay[] = [
    "Woody",
    "Floral",
    "Fresh",
    "Amber & Oriental",
  ];

  const popularKeywords = [
    { label: "Woody", query: "woody" },
    { label: "Rose", query: "rose" },
    { label: "Santal", query: "santal" },
    { label: "Oud", query: "oud" },
    { label: "Amber", query: "amber" },
    { label: "Bergamot", query: "bergamot" },
    { label: "Lavender", query: "lavender" },
  ];

  return (
    <>
      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative flex items-center">
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
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedFamily("all");
            }}
            placeholder="Search by perfume name, fragrance notes, or mood (e.g. Oud, Iris, Santal)..."
            className="w-full h-14 pl-12 pr-12 text-base sm:text-lg bg-pure-white border border-soft-stone rounded-input text-charcoal placeholder:text-muted-taupe/70 shadow-subtle focus:border-charcoal focus:ring-1 focus:ring-champagne focus:outline-none transition-colors"
            autoFocus
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedFamily("all");
              }}
              aria-label="Clear search query"
              className="absolute right-4 p-1.5 text-muted-taupe hover:text-charcoal transition-colors rounded-full"
            >
              ✕
            </button>
          )}
        </div>

        {/* Popular Keyword Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] uppercase tracking-wider text-muted-taupe font-medium mr-1">
            Suggested:
          </span>
          {popularKeywords.map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => {
                setSearchTerm(item.query);
                setSelectedFamily("all");
              }}
              className="px-2.5 py-1 bg-pure-white border border-soft-stone rounded-pill text-[11px] text-charcoal hover:border-champagne hover:text-champagne-dark transition-colors shadow-subtle"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matched Collections Spotlight Banner */}
      {matchedCollections.length > 0 && searchTerm.trim() && (
        <div className="mb-10 p-5 bg-pure-white rounded-card border border-soft-stone shadow-subtle">
          <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-medium block mb-2">
            Curated Collection Matches
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedCollections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group flex items-center gap-3 p-3 rounded-card border border-soft-stone hover:border-champagne/60 transition-all bg-warm-ivory/40"
              >
                <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-soft-stone flex-shrink-0">
                  <Image
                    src={col.heroImage || col.image}
                    alt={col.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm font-medium text-charcoal truncate group-hover:text-champagne-dark transition-colors">
                    {col.title}
                  </h4>
                  <span className="text-[10px] text-muted-taupe uppercase tracking-wider block">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar: Family Tabs, Results Count & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-8 border-b border-soft-stone">
        {/* Family Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedFamily("all")}
            className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-colors ${
              selectedFamily === "all"
                ? "bg-charcoal text-warm-ivory"
                : "bg-pure-white border border-soft-stone text-charcoal hover:border-champagne"
            }`}
          >
            All Families ({rawMatchedProducts.length})
          </button>
          {families.map((fam) => {
            const count = rawMatchedProducts.filter(
              (p) => p.family.toLowerCase() === fam.toLowerCase()
            ).length;
            if (count === 0 && searchTerm.trim()) return null;

            return (
              <button
                key={fam}
                type="button"
                onClick={() => setSelectedFamily(fam)}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-colors ${
                  selectedFamily.toLowerCase() === fam.toLowerCase()
                    ? "bg-charcoal text-warm-ivory"
                    : "bg-pure-white border border-soft-stone text-charcoal hover:border-champagne"
                }`}
              >
                {fam} ({count})
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-muted-taupe">
            {sortedProducts.length === 1
              ? "1 fragrance"
              : `${sortedProducts.length} fragrances`}
          </span>
          <ShopSortSelector value={sortOption} onChange={setSortOption} />
        </div>
      </div>

      {/* Product Results Grid or Empty State */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Fragrances Found"
          description={
            searchTerm.trim()
              ? `We could not find fragrances matching "${searchTerm}". Try searching for notes such as Oud, Rose, Santal, or Amber.`
              : "No fragrances currently match the selected criteria."
          }
          actionLabel="Clear Search"
          onAction={() => {
            setSearchTerm("");
            setSelectedFamily("all");
          }}
        />
      )}
    </>
  );
}

function SearchSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-14 max-w-2xl mx-auto bg-soft-stone/40 rounded-input" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-soft-stone/30 rounded-card" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <StoreLayout>
      <div className="py-8 sm:py-12 md:py-16">
        <Container>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="mb-6 text-xs text-muted-taupe">
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
                >
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-charcoal font-medium" aria-current="page">
                Search
              </li>
            </ol>
          </nav>

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-widest text-champagne-dark font-medium block mb-2">
              Olfactory Concierge
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal tracking-tight">
              Find Your Fragrance
            </h1>
            <p className="mt-3 text-sm text-muted-taupe leading-relaxed font-sans text-balance">
              Discover compositions across our Parisian atelier archives by scent
              notes, botanical accords, emotional moods, or fragrance families.
            </p>
          </div>

          <Suspense fallback={<SearchSkeleton />}>
            <SearchInteractive />
          </Suspense>
        </Container>
      </div>
    </StoreLayout>
  );
}
