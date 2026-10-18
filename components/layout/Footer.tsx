"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    // Realistic subscription simulation with clean development message
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  };

  return (
    <footer className="w-full border-t border-soft-stone bg-warm-ivory text-charcoal pt-16 pb-12 sm:pt-20 sm:pb-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* ===================================================
           * 1. BRAND SECTION
           * =================================================== */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" aria-label="VELORÉ Homepage" className="inline-block">
              <span className="font-serif text-3xl font-medium tracking-wordmark text-charcoal">
                VELORÉ
              </span>
            </Link>
            <p className="mt-2 text-xs text-champagne-dark uppercase tracking-widest font-sans font-medium">
              Luxury Fragrances. Timeless Identity.
            </p>
            <p className="mt-4 text-sm text-muted-taupe leading-relaxed max-w-sm font-sans">
              Distinctive scent profiles and considered formulation designed to express personal style, elevate daily rituals, and leave an enduring, memorable impression.
            </p>
          </div>

          {/* ===================================================
           * 2. SHOP SECTION
           * =================================================== */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase font-medium tracking-widest text-charcoal mb-4">
              Shop Fragrances
            </h4>
            <ul className="space-y-3 text-sm text-muted-taupe">
              <li>
                <Link href="/shop" className="hover:text-charcoal transition-colors">
                  Shop All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-charcoal transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/best-sellers" className="hover:text-charcoal transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-charcoal transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/collections/gifts" className="hover:text-charcoal transition-colors">
                  Gifts & Coffrets
                </Link>
              </li>
            </ul>
          </div>

          {/* ===================================================
           * 3. CUSTOMER CARE SECTION
           * =================================================== */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase font-medium tracking-widest text-charcoal mb-4">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm text-muted-taupe">
              <li>
                <Link href="/contact" className="hover:text-charcoal transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-charcoal transition-colors">
                  White-Glove Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-charcoal transition-colors">
                  Try First Returns
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-charcoal transition-colors">
                  Client FAQs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-charcoal transition-colors">
                  About The Maison
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-charcoal transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-charcoal transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* ===================================================
           * 4. NEWSLETTER SECTION
           * =================================================== */}
          <div className="lg:col-span-4">
            <h4 className="text-xs uppercase font-medium tracking-widest text-charcoal mb-2">
              Letters from VELORÉ
            </h4>
            <p className="text-sm text-muted-taupe leading-relaxed mb-4">
              Receive fragrance inspiration, new collection updates, and stories from the world of scent.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Enter your email address"
                  aria-label="Email for fragrance updates"
                  className="w-full h-11 px-4 text-sm bg-pure-white text-charcoal placeholder:text-muted-taupe/70 rounded-input border border-soft-stone focus:border-charcoal focus:ring-1 focus:ring-champagne focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 px-6 text-xs uppercase tracking-wider font-medium text-warm-ivory bg-charcoal hover:bg-charcoal-hover rounded-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne whitespace-nowrap disabled:opacity-60"
                >
                  {status === "loading" ? "Joining..." : "Subscribe"}
                </button>
              </div>

              {status === "error" && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {errorMessage}
                </p>
              )}

              {status === "success" && (
                <p className="text-xs text-champagne-dark mt-1 font-medium" role="status">
                  Thank you for subscribing. Welcome to the VELORÉ circle. (Demo state: email integration ready)
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Fine Print */}
        <div className="mt-14 pt-8 border-t border-soft-stone flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-taupe">
          <p>© {new Date().getFullYear()} VELORÉ Haute Parfumerie. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-charcoal transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-charcoal transition-colors">
              Terms
            </Link>
            <Link href="/our-story" className="hover:text-charcoal transition-colors">
              Artisan Commitment
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
