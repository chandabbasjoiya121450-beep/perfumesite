"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { IconButton } from "@/components/ui/IconButton";
import { useStore } from "@/context/StoreContext";

export interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { cartCount, wishlistCount, openCart } = useStore();

  // Scroll listener for smooth sticky compact state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard Escape listener & focus management for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
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
  }, [mobileMenuOpen]);

  // Close drawer whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Best Sellers", href: "/collections/best-sellers" },
    { label: "Our Story", href: "/our-story" },
    { label: "Journal", href: "/journal" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-hover ease-luxury ${
        isScrolled
          ? "bg-warm-ivory/95 backdrop-blur-md border-b border-soft-stone shadow-subtle py-3"
          : "bg-warm-ivory border-b border-soft-stone/70 py-4 sm:py-5"
      }`}
    >
      <Container className="flex items-center justify-between">
        {/* =======================================================
         * 1. LEFT AREA: VELORÉ Wordmark (Desktop) / Menu (Mobile)
         * ======================================================= */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <IconButton
              size="sm"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={() => setMobileMenuOpen(true)}
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
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </IconButton>
          </div>

          {/* Brand Wordmark */}
          <Link
            href="/"
            aria-label="VELORÉ Homepage"
            className="group flex flex-col items-start py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne rounded-sm"
          >
            <span className="font-serif text-2xl sm:text-[28px] font-medium tracking-wordmark text-charcoal group-hover:text-charcoal-hover transition-colors duration-hover">
              VELORÉ
            </span>
            <span className="text-[8.5px] uppercase tracking-widest text-champagne-dark font-sans opacity-90 -mt-1">
              Haute Parfumerie
            </span>
          </Link>
        </div>

        {/* =======================================================
         * 2. CENTER AREA: Primary Navigation (Desktop)
         * ======================================================= */}
        <nav
          className="hidden lg:flex items-center gap-7 xl:gap-9"
          aria-label="Primary Navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase font-medium tracking-wider transition-colors duration-hover relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne rounded-sm ${
                  isActive
                    ? "text-charcoal font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-charcoal"
                    : "text-charcoal/75 hover:text-champagne-dark"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* =======================================================
         * 3. RIGHT AREA: Search, Account, Wishlist, Cart
         * ======================================================= */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          {onSearchClick ? (
            <IconButton
              size="sm"
              aria-label="Search fragrances"
              onClick={onSearchClick}
            >
              <svg
                className="w-4 h-4 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </IconButton>
          ) : (
            <Link
              href="/search"
              aria-label="Search fragrances"
              className="inline-flex items-center justify-center h-9 w-9 text-charcoal hover:bg-soft-stone/60 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            >
              <svg
                className="w-4 h-4 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
          )}

          {/* Account Link */}
          <Link
            href="/account"
            aria-label="Customer Account"
            className="hidden sm:inline-flex items-center justify-center h-9 w-9 text-charcoal hover:bg-soft-stone/60 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <svg
              className="w-4 h-4 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          {/* Wishlist Link with Live Indicator */}
          <Link
            href="/wishlist"
            aria-label={`Curated Wishlist (${wishlistCount} items)`}
            className="relative inline-flex items-center justify-center h-9 w-9 text-charcoal hover:bg-soft-stone/60 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <svg
              className="w-4 h-4 stroke-current"
              fill={wishlistCount > 0 ? "#B69B72" : "none"}
              stroke={wishlistCount > 0 ? "#B69B72" : "currentColor"}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-champagne text-white text-[9px] font-semibold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag Button with Live Indicator (Opens Cart Drawer) */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Shopping Bag (${cartCount} items)`}
            className="relative inline-flex items-center justify-center h-9 w-9 text-charcoal hover:bg-soft-stone/60 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <svg
              className="w-4 h-4 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-charcoal text-warm-ivory text-[9px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </Container>

      {/* =======================================================
       * 4. MOBILE NAVIGATION DRAWER
       * ======================================================= */}
      {mobileMenuOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-modal ease-luxury"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-warm-ivory shadow-modal border-r border-soft-stone z-10 flex flex-col justify-between p-6 sm:p-8 animate-fade-in"
          >
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-6 border-b border-soft-stone">
                <div>
                  <span className="font-serif text-2xl font-medium tracking-wordmark text-charcoal">
                    VELORÉ
                  </span>
                  <span className="block text-[8px] uppercase tracking-widest text-champagne-dark">
                    Haute Parfumerie
                  </span>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
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

              {/* Drawer Nav Links */}
              <nav className="mt-8 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-widest text-charcoal hover:text-champagne font-medium transition-colors py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Extra Mobile Links */}
              <div className="mt-8 pt-6 border-t border-soft-stone space-y-4 text-xs tracking-wider uppercase text-muted-taupe">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSearchClick?.();
                  }}
                  className="w-full text-left hover:text-charcoal transition-colors py-1 flex items-center justify-between"
                >
                  <span>Search Fragrances</span>
                  <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-charcoal transition-colors py-1"
                >
                  Client Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-charcoal transition-colors py-1 flex items-center justify-between"
                >
                  <span>Curated Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="px-2 py-0.5 rounded-pill bg-champagne-subtle text-champagne-dark font-medium text-[10px]">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/collections/gifts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-charcoal transition-colors py-1"
                >
                  Gift Sets & Coffrets
                </Link>
                <Link
                  href="/fragrance-finder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-champagne transition-colors py-1 font-medium text-champagne-dark"
                >
                  Fragrance Finder →
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-soft-stone text-[11px] text-muted-taupe">
              <p>Atelier Paris · Est. 2026</p>
              <p className="mt-1">Luxury Fragrances. Timeless Identity.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
