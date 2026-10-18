"use client";

import React from "react";

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export interface ShopSortSelectorProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export const ShopSortSelector: React.FC<ShopSortSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="shop-sort"
        className="text-xs uppercase font-medium tracking-wider text-muted-taupe whitespace-nowrap"
      >
        Sort By:
      </label>
      <div className="relative">
        <select
          id="shop-sort"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="h-10 pl-3 pr-8 text-xs font-sans bg-pure-white text-charcoal border border-soft-stone rounded-btn appearance-none cursor-pointer focus:border-charcoal focus:ring-1 focus:ring-champagne focus:outline-none transition-colors"
        >
          <option value="featured">Featured Compositions</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-taupe">
          <svg
            className="w-3.5 h-3.5 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
