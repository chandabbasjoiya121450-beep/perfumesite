"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
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
import { PRODUCTS, Product, sortProducts } from "@/lib/data/products";

const ITEMS_PER_PAGE = 8;

function ShopInteractive() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL search params into initial filter state
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

  // Local state for active controls
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "featured"
  );
  const [currentPage, setCurrentPage] = useState<number>(
    searchParams.get("page") ? Math.max(1, Number(searchParams.get("page"))) : 1
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || ""
  );
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync live products from database
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setCatalogProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  // Sync state when URL params change externally (back/forward navigation)
  useEffect(() => {
    setFilters(initialFilters);
    const sortParam = (searchParams.get("sort") as SortOption) || "featured";
    setSortOption(sortParam);
    const pageParam = searchParams.get("page")
      ? Math.max(1, Number(searchParams.get("page")))
      : 1;
    setCurrentPage(pageParam);
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams, initialFilters]);

  // Synchronize filter & sort state into URL query params
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
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  }, [filters, sortOption, currentPage, searchQuery, pathname, router]);

  // Filter calculations
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      // 1. Text Search query (optional q parameter)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
        const matchesDescription = product.description.toLowerCase().includes(q);
        const matchesNotes = [
          ...product.topNotes,
          ...product.heartNotes,
          ...product.baseNotes,
        ].some((n) => n.toLowerCase().includes(q));
        if (!matchesName && !matchesSubtitle && !matchesDescription && !matchesNotes) {
          return false;
        }
      }

      // 2. Fragrance Family filter
      if (
        filters.families.length > 0 &&
        !filters.families.includes(product.fragranceFamily)
      ) {
        return false;
      }

      // 3. Price Range filter
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }

      // 4. In-Stock filter
      if (filters.inStockOnly && !product.isAvailable) {
        return false;
      }

      // 5. Occasion filter
      if (filters.occasions.length > 0) {
        const hasOccasion = product.occasionTags?.some((occ) =>
          filters.occasions.includes(occ)
        );
        if (!hasOccasion) return false;
      }

      // 6. Season filter
      if (filters.seasons.length > 0) {
        const hasSeason = product.seasonTags?.some((season) =>
          filters.seasons.includes(season)
        );
        if (!hasSeason) return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortOption);
  }, [filteredProducts, sortOption]);

  // Pagination calculation
  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));

  // If currentPage exceeds totalPages due to filtering, clamp it
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

  // Dynamic counts for each family, occasion, and season for sidebar badges
  const productCounts = useMemo(() => {
    const families: Record<string, number> = {};
    const occasions: Record<string, number> = {};
    const seasons: Record<string, number> = {};

    PRODUCTS.forEach((p) => {
      families[p.family] = (families[p.family] || 0) + 1;
      p.occasionTags?.forEach((occ) => {
        occasions[occ] = (occasions[occ] || 0) + 1;
      });
      p.seasonTags?.forEach((sea) => {
        seasons[sea] = (seasons[sea] || 0) + 1;
      });
    });

    return { families, occasions, seasons };
  }, []);

  // Handlers
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
    setSearchQuery("");
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
      {/* Controls Bar: Filter Button (Mobile), Count, Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-soft-stone">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
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
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-champagne text-white text-[10px] font-semibold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Product Match Count */}
          <span className="text-xs text-muted-taupe font-sans">
            {totalProducts === 1
              ? "1 composition available"
              : `${totalProducts} compositions available`}
          </span>
        </div>

        {/* Sorting Selector */}
        <ShopSortSelector
          value={sortOption}
          onChange={(s) => {
            setSortOption(s);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Active Filters Removable Chips */}
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

      {/* Main Shop Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-28 bg-pure-white p-6 rounded-card border border-soft-stone shadow-subtle">
          <ShopFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            productCounts={productCounts}
          />
        </div>

        {/* Products Grid Column */}
        <div className="lg:col-span-9">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <ShopPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalProducts={totalProducts}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 180, behavior: "smooth" });
                }}
              />
            </>
          ) : (
            /* Empty State */
            <EmptyState
              title="No Fragrances Found"
              description="Try adjusting your filters or expanding your price range to discover more artisan creations."
              actionLabel="Clear All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>

      {/* Accessible Mobile Filter Drawer */}
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

function ShopSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-soft-stone">
        <div className="h-4 w-36 bg-soft-stone rounded" />
        <div className="h-9 w-44 bg-soft-stone rounded-btn" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="hidden lg:block lg:col-span-3 bg-pure-white p-6 rounded-card border border-soft-stone h-96" />
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-soft-stone/40 rounded-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <StoreLayout>
      <div className="py-8 sm:py-12 md:py-16">
        <Container>
          {/* 1. Breadcrumbs */}
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
                Shop
              </li>
            </ol>
          </nav>

          {/* 2. Page Header */}
          <div className="mb-10 text-center sm:text-left max-w-2xl">
            <span className="text-[11px] uppercase tracking-widest text-champagne-dark font-medium block mb-2">
              The Complete Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal tracking-tight">
              Explore Our Fragrances
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-taupe leading-relaxed font-sans text-balance">
              Immerse yourself in our full universe of artisanal extraits and eau de
              parfums. Masterfully formulated from rare botanical absolutes, precious
              woods, and golden resins.
            </p>
          </div>

          {/* 3. Interactive Filtering, Sorting, Grid, & Pagination */}
          <Suspense fallback={<ShopSkeleton />}>
            <ShopInteractive />
          </Suspense>
        </Container>
      </div>
    </StoreLayout>
  );
}
