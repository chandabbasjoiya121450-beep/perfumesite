"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { FragranceFamilyDisplay } from "@/lib/data/products";

export interface FilterState {
  families: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  occasions: string[];
  seasons: string[];
}

export interface ShopFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  productCounts: {
    families: Record<string, number>;
    occasions: Record<string, number>;
    seasons: Record<string, number>;
  };
}

export const ShopFilterSidebar: React.FC<ShopFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  productCounts,
}) => {
  const families: FragranceFamilyDisplay[] = [
    "Woody",
    "Floral",
    "Fresh",
    "Amber & Oriental",
  ];

  const occasions = ["Everyday Signature", "Evening & Occasion"];
  const seasons = ["All Seasons", "Spring", "Summer", "Autumn", "Winter"];

  const pricePresets = [
    { label: "All Prices", min: null, max: null },
    { label: "Under $260", min: 0, max: 260 },
    { label: "$260 – $300", min: 260, max: 300 },
    { label: "$300 – $350", min: 300, max: 350 },
    { label: "Over $350", min: 350, max: 9999 },
  ];

  const toggleFamily = (fam: string) => {
    const updated = filters.families.includes(fam)
      ? filters.families.filter((f) => f !== fam)
      : [...filters.families, fam];
    onFilterChange({ ...filters, families: updated });
  };

  const toggleOccasion = (occ: string) => {
    const updated = filters.occasions.includes(occ)
      ? filters.occasions.filter((o) => o !== occ)
      : [...filters.occasions, occ];
    onFilterChange({ ...filters, occasions: updated });
  };

  const toggleSeason = (season: string) => {
    const updated = filters.seasons.includes(season)
      ? filters.seasons.filter((s) => s !== season)
      : [...filters.seasons, season];
    onFilterChange({ ...filters, seasons: updated });
  };

  const setPriceRange = (min: number | null, max: number | null) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const hasActiveFilters =
    filters.families.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.inStockOnly ||
    filters.occasions.length > 0 ||
    filters.seasons.length > 0;

  return (
    <aside className="w-full space-y-8" aria-label="Product Filters">
      {/* Header and Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-soft-stone">
        <h3 className="font-serif text-lg text-charcoal font-medium">Filter Creations</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs uppercase tracking-wider text-champagne-dark hover:text-charcoal underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 1. Fragrance Family */}
      <div>
        <h4 className="text-xs uppercase font-medium tracking-widest text-charcoal mb-3.5">
          Fragrance Family
        </h4>
        <div className="space-y-2.5">
          {families.map((fam) => {
            const isChecked = filters.families.includes(fam);
            const count = productCounts.families[fam] || 0;
            return (
              <label
                key={fam}
                className="flex items-center justify-between text-xs text-charcoal/85 hover:text-charcoal cursor-pointer select-none group"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFamily(fam)}
                    className="w-4 h-4 rounded border-soft-stone text-charcoal focus:ring-champagne focus:ring-offset-warm-ivory cursor-pointer"
                  />
                  <span className={isChecked ? "font-medium text-charcoal" : ""}>
                    {fam}
                  </span>
                </div>
                <span className="text-[11px] text-muted-taupe font-mono">
                  ({count})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range */}
      <div>
        <h4 className="text-xs uppercase font-medium tracking-widest text-charcoal mb-3.5">
          Price (USD)
        </h4>
        <div className="space-y-2">
          {pricePresets.map((preset) => {
            const isSelected =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setPriceRange(preset.min, preset.max)}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-btn transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-charcoal text-warm-ivory font-medium"
                    : "text-charcoal/80 hover:bg-soft-stone/40"
                }`}
              >
                <span>{preset.label}</span>
                {isSelected && <span>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max inputs */}
        <div className="mt-3.5 pt-3 border-t border-soft-stone/60 flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="1000"
            placeholder="Min $"
            value={filters.minPrice ?? ""}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              onFilterChange({ ...filters, minPrice: val });
            }}
            className="w-1/2 h-8 px-2.5 text-xs bg-pure-white border border-soft-stone rounded-md focus:border-charcoal focus:outline-none"
          />
          <span className="text-muted-taupe text-xs">–</span>
          <input
            type="number"
            min="0"
            max="1000"
            placeholder="Max $"
            value={filters.maxPrice ?? ""}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              onFilterChange({ ...filters, maxPrice: val });
            }}
            className="w-1/2 h-8 px-2.5 text-xs bg-pure-white border border-soft-stone rounded-md focus:border-charcoal focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Occasion */}
      <div>
        <h4 className="text-xs uppercase font-medium tracking-widest text-charcoal mb-3.5">
          Occasion
        </h4>
        <div className="space-y-2.5">
          {occasions.map((occ) => {
            const isChecked = filters.occasions.includes(occ);
            const count = productCounts.occasions[occ] || 0;
            return (
              <label
                key={occ}
                className="flex items-center justify-between text-xs text-charcoal/85 hover:text-charcoal cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOccasion(occ)}
                    className="w-4 h-4 rounded border-soft-stone text-charcoal focus:ring-champagne cursor-pointer"
                  />
                  <span className={isChecked ? "font-medium text-charcoal" : ""}>
                    {occ}
                  </span>
                </div>
                <span className="text-[11px] text-muted-taupe font-mono">
                  ({count})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Season */}
      <div>
        <h4 className="text-xs uppercase font-medium tracking-widest text-charcoal mb-3.5">
          Season
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {seasons.map((season) => {
            const isSelected = filters.seasons.includes(season);
            return (
              <button
                key={season}
                type="button"
                onClick={() => toggleSeason(season)}
                className={`px-3 py-1 text-xs rounded-pill border transition-colors ${
                  isSelected
                    ? "bg-charcoal text-warm-ivory border-charcoal font-medium"
                    : "bg-pure-white text-muted-taupe border-soft-stone hover:border-charcoal/50"
                }`}
              >
                {season}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Availability */}
      <div className="pt-2 border-t border-soft-stone">
        <label className="flex items-center gap-2.5 text-xs text-charcoal cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="w-4 h-4 rounded border-soft-stone text-charcoal focus:ring-champagne cursor-pointer"
          />
          <span className="font-medium">In Stock Flacons Only</span>
        </label>
      </div>
    </aside>
  );
};
