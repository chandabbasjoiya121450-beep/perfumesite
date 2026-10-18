"use client";

import React from "react";
import { FilterState } from "./ShopFilterSidebar";

export interface ShopActiveFiltersProps {
  filters: FilterState;
  onRemoveFamily: (family: string) => void;
  onRemovePrice: () => void;
  onRemoveOccasion: (occasion: string) => void;
  onRemoveSeason: (season: string) => void;
  onRemoveStock: () => void;
  onClearAll: () => void;
}

export const ShopActiveFilters: React.FC<ShopActiveFiltersProps> = ({
  filters,
  onRemoveFamily,
  onRemovePrice,
  onRemoveOccasion,
  onRemoveSeason,
  onRemoveStock,
  onClearAll,
}) => {
  const hasActiveFilters =
    filters.families.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.inStockOnly ||
    filters.occasions.length > 0 ||
    filters.seasons.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 pt-2">
      <span className="text-[11px] uppercase tracking-wider text-muted-taupe mr-1">
        Active Filters:
      </span>

      {/* Fragrance Families */}
      {filters.families.map((fam) => (
        <span
          key={fam}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-pure-white border border-soft-stone rounded-pill text-xs text-charcoal shadow-subtle"
        >
          <span>{fam}</span>
          <button
            type="button"
            onClick={() => onRemoveFamily(fam)}
            className="text-muted-taupe hover:text-charcoal p-0.5"
            aria-label={`Remove filter ${fam}`}
          >
            ✕
          </button>
        </span>
      ))}

      {/* Price */}
      {(filters.minPrice !== null || filters.maxPrice !== null) && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pure-white border border-soft-stone rounded-pill text-xs text-charcoal shadow-subtle">
          <span>
            {filters.minPrice !== null && filters.maxPrice !== null
              ? `$${filters.minPrice} – $${filters.maxPrice}`
              : filters.minPrice !== null
              ? `Over $${filters.minPrice}`
              : `Under $${filters.maxPrice}`}
          </span>
          <button
            type="button"
            onClick={onRemovePrice}
            className="text-muted-taupe hover:text-charcoal p-0.5"
            aria-label="Remove price filter"
          >
            ✕
          </button>
        </span>
      )}

      {/* Occasions */}
      {filters.occasions.map((occ) => (
        <span
          key={occ}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-pure-white border border-soft-stone rounded-pill text-xs text-charcoal shadow-subtle"
        >
          <span>{occ}</span>
          <button
            type="button"
            onClick={() => onRemoveOccasion(occ)}
            className="text-muted-taupe hover:text-charcoal p-0.5"
            aria-label={`Remove filter ${occ}`}
          >
            ✕
          </button>
        </span>
      ))}

      {/* Seasons */}
      {filters.seasons.map((season) => (
        <span
          key={season}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-pure-white border border-soft-stone rounded-pill text-xs text-charcoal shadow-subtle"
        >
          <span>{season}</span>
          <button
            type="button"
            onClick={() => onRemoveSeason(season)}
            className="text-muted-taupe hover:text-charcoal p-0.5"
            aria-label={`Remove filter ${season}`}
          >
            ✕
          </button>
        </span>
      ))}

      {/* In Stock */}
      {filters.inStockOnly && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pure-white border border-soft-stone rounded-pill text-xs text-charcoal shadow-subtle">
          <span>In Stock Flacons</span>
          <button
            type="button"
            onClick={onRemoveStock}
            className="text-muted-taupe hover:text-charcoal p-0.5"
            aria-label="Remove in stock filter"
          >
            ✕
          </button>
        </span>
      )}

      {/* Clear All */}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs uppercase tracking-wider text-champagne-dark hover:text-charcoal underline ml-2"
      >
        Clear All
      </button>
    </div>
  );
};
