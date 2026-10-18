import React from "react";
import Link from "next/link";
import { Product, getRelatedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductRelatedProps {
  product: Product;
}

export function ProductRelated({ product }: ProductRelatedProps) {
  const related = getRelatedProducts(product, 4);

  if (!related || related.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-soft-stone">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-champagne-dark font-medium block mb-2">
            Curated Recommendations
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal">
            You May Also Like
          </h2>
        </div>
        <Link
          href={`/collections/${product.fragranceFamily}`}
          className="text-xs uppercase tracking-wider text-charcoal font-medium hover:text-champagne-dark transition-colors inline-flex items-center gap-1 group"
        >
          <span>Explore All {product.family} Fragrances</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
