"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Collection, Product, sortProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ShopFilterSidebar,
  FilterState,
  ShopActiveFilters,
  ShopSortSelector,
  SortOption,
  ShopPagination,
  ShopMobileDrawer,
} from "@/components/shop";

const ITEMS_PER_PAGE = 8;

interface CollectionInteractiveProps {
  collection: Collection;
  baseProducts: Product[];
}

export function CollectionInteractive({
  collection,
  baseProducts,
}: CollectionInteractiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL search params
  const initialFilters: FilterState = useMemo(() => {
    const familyParam = searchParams.get("family");
    const families = familyParam
      ? familyParam.split(",").filter(Boolean)
      : [];

    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : null;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : null;

    const inStockOnly = searchParams.get("inStock") === "true";

    const occasionParam = searchParams.get("occasion");
    const occasions = occasionParam
      ? occasionParam.split(",").filter(Boolean)
      : [];

    const seasonParam = searchParams.get("season");
    const seasons = seasonParam
      ? seasonParam.split(",").filter(Boolean)
      : [];

    return {
      families,
      minPrice,
      maxPrice,
      inStockOnly,
      occasions,
      seasons,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "featured"
  );
  const [currentPage, setCurrentPage] = useState<number>(
    searchParams.get("page") ? Math.max(1, Number(searchParams.get("page"))) : 1
  );
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync state when URL params change externally
  useEffect(() => {
    setFilters(initialFilters);
    const sortParam = (searchParams.get("sort") as SortOption) || "featured";
    setSortOption(sortParam);
    const pageParam = searchParams.get("page")
      ? Math.max(1, Number(searchParams.get("page")))
      : 1;
    setCurrentPage(pageParam);
  }, [searchParams, initialFilters]);

  // Synchronize state back into URL search params
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.families.length > 0) {
      params.set("family", filters.families.join(","));
    }
    if (filters.minPrice !== null && !isNaN(filters.minPrice)) {
      params.set("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== null && !isNaN(filters.maxPrice)) {
      params.set("maxPrice", filters.maxPrice.toString());
    }
    if (filters.inStockOnly) {
      params.set("inStock", "true");
    }
    if (filters.occasions.length > 0) {
      params.set("occasion", filters.occasions.join(","));
    }
    if (filters.seasons.length > 0) {
      params.set("season", filters.seasons.join(","));
    }
    if (sortOption !== "featured") {
      params.set("sort", sortOption);
    }
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  }, [filters, sortOption, currentPage, pathname, router]);

  // Refine strictly within the baseProducts of this collection
  const filteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      // 1. Family filter
      if (
        filters.families.length > 0 &&
        !filters.families.includes(product.fragranceFamily)
      ) {
        return false;
      }

      // 2. Price filter
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }

      // 3. In-Stock filter
      if (filters.inStockOnly && !product.isAvailable) {
        return false;
      }

      // 4. Occasion filter
      if (filters.occasions.length > 0) {
        const hasOccasion = product.occasionTags?.some((occ) =>
          filters.occasions.includes(occ)
        );
        if (!hasOccasion) return false;
      }

      // 5. Season filter
      if (filters.seasons.length > 0) {
        const hasSeason = product.seasonTags?.some((season) =>
          filters.seasons.includes(season)
        );
        if (!hasSeason) return false;
      }

      return true;
    });
  }, [baseProducts, filters]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortOption);
  }, [filteredProducts, sortOption]);

  // Pagination
  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalProducts);
  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, startIndex, endIndex]);

  // Dynamic counts of base products by family, occasion, and season
  const productCounts = useMemo(() => {
    const families: Record<string, number> = {};
    const occasions: Record<string, number> = {};
    const seasons: Record<string, number> = {};

    baseProducts.forEach((p) => {
      families[p.family] = (families[p.family] || 0) + 1;
      p.occasionTags?.forEach((occ) => {
        occasions[occ] = (occasions[occ] || 0) + 1;
      });
      p.seasonTags?.forEach((sea) => {
        seasons[sea] = (seasons[sea] || 0) + 1;
      });
    });

    return { families, occasions, seasons };
  }, [baseProducts]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      families: [],
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
      occasions: [],
      seasons: [],
    });
    setCurrentPage(1);
  };

  const activeFilterCount =
    filters.families.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    filters.occasions.length +
    filters.seasons.length;

  return (
    <>
      {/* Controls Bar: Filter Button (Mobile), Matching Count, Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-soft-stone">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-pure-white border border-soft-stone rounded-btn text-xs uppercase tracking-wider font-medium text-charcoal shadow-subtle hover:border-champagne"
          >
            <svg
              className="w-4 h-4 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-champagne text-white text-[10px] font-semibold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Product Count */}
          <span className="text-xs text-muted-taupe font-sans">
            {totalProducts === baseProducts.length ? (
              totalProducts === 1
                ? "1 curated fragrance"
                : `${totalProducts} curated fragrances`
            ) : (
              `Showing ${totalProducts} of ${baseProducts.length} fragrances`
            )}
          </span>
        </div>

        {/* Sorting Dropdown */}
        <ShopSortSelector
          value={sortOption}
          onChange={(s) => {
            setSortOption(s);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Active Filter Chips */}
      <ShopActiveFilters
        filters={filters}
        onRemoveFamily={(fam) =>
          handleFilterChange({
            ...filters,
            families: filters.families.filter((f) => f !== fam),
          })
        }
        onRemovePrice={() =>
          handleFilterChange({
            ...filters,
            minPrice: null,
            maxPrice: null,
          })
        }
        onRemoveOccasion={(occ) =>
          handleFilterChange({
            ...filters,
            occasions: filters.occasions.filter((o) => o !== occ),
          })
        }
        onRemoveSeason={(s) =>
          handleFilterChange({
            ...filters,
            seasons: filters.seasons.filter((season) => season !== s),
          })
        }
        onRemoveStock={() =>
          handleFilterChange({ ...filters, inStockOnly: false })
        }
        onClearAll={handleResetFilters}
      />

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-28 bg-pure-white p-6 rounded-card border border-soft-stone shadow-subtle">
          <div className="pb-3 mb-4 border-b border-soft-stone flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal">
              Refine Collection
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-champagne-dark hover:text-charcoal transition-colors underline"
              >
                Reset
              </button>
            )}
          </div>
          <ShopFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            productCounts={productCounts}
          />
        </div>

        {/* Product Grid Column */}
        <div className="lg:col-span-9">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <ShopPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalProducts={totalProducts}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 250, behavior: "smooth" });
                  }}
                />
              )}
            </>
          ) : (
            /* Empty State */
            <EmptyState
              title="No Fragrances Match These Filters"
              description={`We could not find fragrances in "${collection.title}" matching your selected criteria. Try adjusting your filters.`}
              actionLabel="Clear Collection Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <ShopMobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        matchingCount={totalProducts}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        productCounts={productCounts}
      />
    </>
  );
}
