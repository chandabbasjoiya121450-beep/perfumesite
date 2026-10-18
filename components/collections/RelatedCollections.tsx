import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Collection, Product, getProductsByCollection } from "@/lib/data/products";

interface RelatedCollectionsProps {
  collections: Collection[];
  allProducts: Product[];
}

export function RelatedCollections({ collections }: RelatedCollectionsProps) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-soft-stone">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-champagne-dark font-medium block mb-2">
            Continue Your Discovery
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal">
            Related Collections
          </h2>
        </div>
        <Link
          href="/collections"
          className="text-xs uppercase tracking-wider text-charcoal font-medium hover:text-champagne-dark transition-colors inline-flex items-center gap-1 group"
        >
          <span>View All Collections</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {collections.map((col) => {
          const colProducts = getProductsByCollection(col.slug);
          const imageSrc = col.heroImage || col.image || "/images/products/collection-exclusive.jpg";

          return (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative flex flex-col bg-pure-white rounded-card border border-soft-stone overflow-hidden shadow-subtle hover:shadow-card hover:border-champagne/40 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-soft-stone/30">
                <Image
                  src={imageSrc}
                  alt={col.imageAlt || `VELORÉ ${col.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-charcoal/15 group-hover:bg-charcoal/5 transition-colors" />
                <div className="absolute top-3 left-3 bg-warm-ivory/90 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-soft-stone/60">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-charcoal">
                    {colProducts.length === 1 ? "1 Fragrance" : `${colProducts.length} Fragrances`}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-medium block">
                    {col.subtitle || "Curated Archive"}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal mt-1 group-hover:text-champagne-dark transition-colors">
                    {col.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-taupe line-clamp-2 leading-relaxed">
                    {col.shortDescription || col.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-soft-stone/60 flex items-center justify-between text-xs font-medium text-charcoal">
                  <span>Explore Collection</span>
                  <span className="group-hover:translate-x-1 transition-transform text-champagne-dark">
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
