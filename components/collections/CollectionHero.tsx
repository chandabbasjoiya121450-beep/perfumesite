import React from "react";
import Image from "next/image";
import { Collection } from "@/lib/data/products";

interface CollectionHeroProps {
  collection: Collection;
  productCount: number;
}

export function CollectionHero({ collection, productCount }: CollectionHeroProps) {
  const heroImageSrc = collection.heroImage || collection.image || "/images/products/collection-exclusive.jpg";
  const imageAlt = collection.imageAlt || `VELORÉ ${collection.title} collection`;

  return (
    <section className="relative mb-10 sm:mb-12 rounded-card overflow-hidden border border-soft-stone shadow-card bg-charcoal">
      {/* Background Hero Image */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] w-full min-h-[320px] sm:min-h-[360px]">
        <Image
          src={heroImageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
          className="object-cover object-center brightness-95"
        />

        {/* Sophisticated Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30 sm:bg-gradient-to-r sm:from-charcoal/90 sm:via-charcoal/70 sm:to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center p-6 sm:p-10 md:p-14">
          <div className="max-w-2xl text-warm-ivory z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="inline-block w-6 h-px bg-champagne" />
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-champagne-light font-medium">
                {collection.subtitle || "Curated Olfactory Archive"}
              </span>
            </div>

            {/* Collection Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-pure-white leading-tight">
              {collection.title}
            </h1>

            {/* Editorial Description */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-stone-200/90 leading-relaxed font-sans max-w-xl text-balance">
              {collection.description}
            </p>

            {/* Key Collection Metrics */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-white/15 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                <span className="font-medium text-warm-ivory">
                  {productCount === 1 ? "1 Master Composition" : `${productCount} Master Compositions`}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne/60" />
                <span>Haute Parfumerie Concentration</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne/60" />
                <span>Artisan Small-Batch Blends</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
