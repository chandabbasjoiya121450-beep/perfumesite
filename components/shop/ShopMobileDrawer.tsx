"use client";

import React, { useEffect, useRef } from "react";
import { ShopFilterSidebar, ShopFilterProps } from "./ShopFilterSidebar";

export interface ShopMobileDrawerProps extends ShopFilterProps {
  isOpen: boolean;
  onClose: () => void;
  matchingCount: number;
}

export const ShopMobileDrawer: React.FC<ShopMobileDrawerProps> = ({
  isOpen,
  onClose,
  matchingCount,
  ...filterProps
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="presentation" className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-modal ease-luxury"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter Fragrances"
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-warm-ivory shadow-modal border-l border-soft-stone z-10 flex flex-col justify-between p-6 sm:p-8 animate-fade-in"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-soft-stone">
          <div>
            <h3 className="font-serif text-xl text-charcoal font-medium">Filter Fragrances</h3>
            <span className="text-xs text-muted-taupe">
              {matchingCount} {matchingCount === 1 ? "creation" : "creations"} matching
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 text-charcoal hover:bg-soft-stone rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <svg
              className="w-5 h-5 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto py-6 pr-1">
          <ShopFilterSidebar {...filterProps} />
        </div>

        {/* Bottom Apply Action */}
        <div className="pt-4 border-t border-soft-stone">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-6 bg-charcoal text-warm-ivory text-xs uppercase tracking-widest font-medium rounded-pill shadow-modal hover:bg-charcoal-hover transition-colors"
          >
            View {matchingCount} Fragrances
          </button>
        </div>
      </div>
    </div>
  );
};
