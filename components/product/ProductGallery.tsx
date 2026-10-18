"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/data/products";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  // Use product.images or fallback to [product.image]
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || "/images/products/product-noir.jpg"];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const currentImage = images[activeIndex] || images[0];

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Product Image Container */}
      <div className="relative aspect-[4/5] w-full bg-soft-stone/20 rounded-card overflow-hidden border border-soft-stone shadow-card group">
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full h-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          aria-label={`View enlarged image of ${product.name}`}
        >
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-soft-stone/30">
              <span className="font-serif text-2xl text-charcoal mb-2">VELORÉ</span>
              <p className="text-xs uppercase tracking-wider text-muted-taupe">
                Flacon Photography Archive
              </p>
            </div>
          ) : (
            <Image
              src={currentImage}
              alt={product.imageAlt || `${product.name} luxury flacon`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              onError={() => setImgError(true)}
              className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />
          )}

          {/* Luxury Zoom Pill Indicator */}
          <span className="absolute bottom-4 right-4 bg-pure-white/90 backdrop-blur-xs px-3 py-1.5 rounded-pill text-[10px] uppercase tracking-widest text-charcoal font-medium shadow-subtle border border-soft-stone flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
            <span>Zoom</span>
          </span>
        </button>
      </div>

      {/* Thumbnails Strip (if multiple images exist) */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Select product image view ${idx + 1}`}
              aria-current={activeIndex === idx ? "true" : undefined}
              className={`relative aspect-[4/5] w-20 flex-shrink-0 rounded-image overflow-hidden border transition-all ${
                activeIndex === idx
                  ? "border-champagne ring-1 ring-champagne shadow-subtle"
                  : "border-soft-stone hover:border-muted-taupe/60 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} view ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Accessible Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged image of ${product.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close enlarged image view"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 p-2.5 rounded-full bg-pure-white/10 text-warm-ivory hover:bg-pure-white/20 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <svg
              className="w-6 h-6 stroke-current"
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

          {/* Modal Image Container */}
          <div
            className="relative max-w-3xl w-full aspect-[4/5] max-h-[85vh] rounded-card overflow-hidden shadow-2xl bg-charcoal"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage}
              alt={product.imageAlt || `${product.name} high-resolution view`}
              fill
              sizes="(max-width: 1200px) 90vw, 800px"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
