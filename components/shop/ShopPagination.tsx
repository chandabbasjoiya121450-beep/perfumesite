"use client";

import React from "react";

export interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

export const ShopPagination: React.FC<ShopPaginationProps> = ({
  currentPage,
  totalPages,
  totalProducts,
  startIndex,
  endIndex,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-14 pt-8 border-t border-soft-stone flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Range Status */}
      <span className="text-xs text-muted-taupe">
        Showing <strong className="text-charcoal font-medium">{startIndex + 1}–{Math.min(endIndex, totalProducts)}</strong> of{" "}
        <strong className="text-charcoal font-medium">{totalProducts}</strong> fragrances
      </span>

      {/* Page Buttons */}
      <nav aria-label="Catalog Pagination" className="inline-flex items-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className="h-9 px-3 rounded-btn border border-soft-stone text-xs font-medium text-charcoal bg-pure-white hover:border-champagne disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        {/* Numbered Pills */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={isActive ? "page" : undefined}
              className={`w-9 h-9 rounded-btn text-xs font-medium transition-colors ${
                isActive
                  ? "bg-charcoal text-warm-ivory border border-charcoal shadow-subtle"
                  : "bg-pure-white text-charcoal border border-soft-stone hover:border-champagne"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          className="h-9 px-3 rounded-btn border border-soft-stone text-xs font-medium text-charcoal bg-pure-white hover:border-champagne disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </nav>
    </div>
  );
};
