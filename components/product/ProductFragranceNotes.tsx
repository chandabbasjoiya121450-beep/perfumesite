import React from "react";
import { Product } from "@/lib/data/products";

interface ProductFragranceNotesProps {
  product: Product;
}

export function ProductFragranceNotes({ product }: ProductFragranceNotesProps) {
  const topNotes = product.topNotes || product.notes?.top || [];
  const heartNotes = product.heartNotes || product.notes?.heart || [];
  const baseNotes = product.baseNotes || product.notes?.base || [];

  return (
    <section className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-soft-stone">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-[11px] uppercase tracking-widest text-champagne-dark font-medium block mb-2">
          Olfactory Architecture
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal">
          Fragrance Notes & Composition
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-muted-taupe leading-relaxed">
          Formulated according to classic French pyramid construction, evolving gradually
          on skin from vibrant volatile accords into deep, resonant base foundations.
        </p>
      </div>

      {/* 3-Tier Olfactory Pyramid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-14">
        {/* Tier 1: Top Notes */}
        <div className="bg-pure-white p-6 sm:p-8 rounded-card border border-soft-stone shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-soft-stone">
              <span className="text-xs uppercase tracking-widest text-champagne-dark font-semibold">
                Opening Impression
              </span>
              <span className="text-[10px] text-muted-taupe uppercase tracking-wider">
                0 – 15 Min
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal mb-3">
              Top Notes
            </h3>
            <p className="text-xs text-muted-taupe mb-4 leading-relaxed">
              The initial aromatic greeting that introduces the fragrance identity upon application.
            </p>
          </div>
          <ul className="space-y-2 pt-2 border-t border-soft-stone/50 text-xs sm:text-sm text-charcoal font-medium">
            {topNotes.map((note, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tier 2: Heart Notes */}
        <div className="bg-pure-white p-6 sm:p-8 rounded-card border border-soft-stone shadow-subtle flex flex-col justify-between ring-1 ring-champagne/30">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-soft-stone">
              <span className="text-xs uppercase tracking-widest text-champagne-dark font-semibold">
                Central Character
              </span>
              <span className="text-[10px] text-muted-taupe uppercase tracking-wider">
                15 Min – 4 Hours
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal mb-3">
              Heart Notes
            </h3>
            <p className="text-xs text-muted-taupe mb-4 leading-relaxed">
              The true soul and core sillage of the composition, revealing its authentic nuances.
            </p>
          </div>
          <ul className="space-y-2 pt-2 border-t border-soft-stone/50 text-xs sm:text-sm text-charcoal font-medium">
            {heartNotes.map((note, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne-dark" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tier 3: Base Notes */}
        <div className="bg-pure-white p-6 sm:p-8 rounded-card border border-soft-stone shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-soft-stone">
              <span className="text-xs uppercase tracking-widest text-champagne-dark font-semibold">
                Enduring Foundation
              </span>
              <span className="text-[10px] text-muted-taupe uppercase tracking-wider">
                4 – 12+ Hours
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal mb-3">
              Base Notes
            </h3>
            <p className="text-xs text-muted-taupe mb-4 leading-relaxed">
              Precious resins, woods, and musks that ground the fragrance and linger intimately on skin.
            </p>
          </div>
          <ul className="space-y-2 pt-2 border-t border-soft-stone/50 text-xs sm:text-sm text-charcoal font-medium">
            {baseNotes.map((note, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-charcoal" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fragrance Specifications Matrix */}
      <div className="max-w-5xl mx-auto p-6 sm:p-8 bg-soft-stone/25 rounded-card border border-soft-stone">
        <h4 className="text-xs uppercase tracking-widest text-charcoal font-semibold mb-6 text-center">
          Artisan Formulation Specifications
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-taupe block mb-1">
              Fragrance Family
            </span>
            <span className="font-serif text-lg text-charcoal font-medium">
              {product.family}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-taupe block mb-1">
              Concentration
            </span>
            <span className="font-serif text-lg text-charcoal font-medium">
              {product.intensity || "Extrait de Parfum"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-taupe block mb-1">
              Tested Longevity
            </span>
            <span className="font-serif text-lg text-charcoal font-medium">
              {product.longevity || "10–12 Hours"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-taupe block mb-1">
              Optimal Season
            </span>
            <span className="font-serif text-lg text-charcoal font-medium">
              {product.seasonTags && product.seasonTags.length > 0
                ? product.seasonTags.join(", ")
                : "All Seasons"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
