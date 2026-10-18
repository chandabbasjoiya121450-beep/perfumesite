import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COLLECTIONS, getProductsByCollection } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Explore Our Collections — Curated Perfume Themes | VELORÉ",
  description:
    "Journey through curated fragrance collections by VELORÉ. From rare woody extraits and intoxicating florals to fresh citrus, evening galas, and bespoke gift coffrets.",
  alternates: {
    canonical: "/collections",
  },
};

export default function CollectionsPage() {
  const allCollections = COLLECTIONS;

  return (
    <StoreLayout>
      <div className="py-8 sm:py-12 md:py-16">
        <Container>
          {/* 1. Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="mb-6 text-xs text-muted-taupe">
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
                >
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-charcoal font-medium" aria-current="page">
                Collections
              </li>
            </ol>
          </nav>

          {/* 2. Editorial Page Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] uppercase tracking-widest text-champagne-dark font-medium block mb-2">
              Olfactory Universes & Curated Themes
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-normal tracking-tight">
              Explore Our Collections
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted-taupe leading-relaxed font-sans text-balance">
              Immerse yourself in carefully curated fragrance worlds. From rare botanical
              distillations and noble woods to intimate evening extraits and thoughtful
              gift presentations.
            </p>
          </div>

          {/* 3. Featured Spotlight Collection: New Arrivals & Best Sellers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {allCollections.slice(0, 2).map((col) => {
              const count = getProductsByCollection(col.slug).length;
              const imageSrc = col.heroImage || col.image;

              return (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group relative block aspect-[16/10] sm:aspect-[16/9] rounded-card overflow-hidden border border-soft-stone shadow-subtle hover:shadow-card transition-all duration-300 bg-charcoal"
                >
                  <Image
                    src={imageSrc}
                    alt={col.imageAlt || `VELORÉ ${col.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-warm-ivory z-10">
                    <span className="text-[10px] uppercase tracking-widest text-champagne-light font-medium">
                      Featured Curation • {count} Fragrances
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-pure-white mt-1 group-hover:text-champagne-light transition-colors">
                      {col.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-stone-200/90 line-clamp-2 max-w-md">
                      {col.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-warm-ivory group-hover:text-champagne-light">
                      <span>Discover Collection</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 4. Complete Collections Grid */}
          <div className="mb-16 sm:mb-24">
            <div className="flex items-center justify-between pb-4 mb-8 border-b border-soft-stone">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-champagne-dark font-medium block">
                  Olfactory Families & Themes
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-normal mt-0.5">
                  All Curated Collections
                </h3>
              </div>
              <span className="text-xs text-muted-taupe">
                {allCollections.length} Curated Archives
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {allCollections.slice(2).map((col) => {
                const count = getProductsByCollection(col.slug).length;
                const imageSrc = col.heroImage || col.image;

                return (
                  <Link
                    key={col.id}
                    href={`/collections/${col.slug}`}
                    className="group relative flex flex-col bg-pure-white rounded-card border border-soft-stone overflow-hidden shadow-subtle hover:shadow-card hover:border-champagne/40 transition-all duration-300"
                  >
                    {/* Collection Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-soft-stone/20">
                      <Image
                        src={imageSrc}
                        alt={col.imageAlt || `VELORÉ ${col.title}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/0 transition-colors" />
                      <div className="absolute top-3 left-3 bg-warm-ivory/95 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-soft-stone/60">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-charcoal">
                          {count === 1 ? "1 Fragrance" : `${count} Fragrances`}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-medium block">
                          {col.subtitle || "Curated Archive"}
                        </span>
                        <h4 className="font-serif text-xl sm:text-2xl text-charcoal mt-1 group-hover:text-champagne-dark transition-colors">
                          {col.title}
                        </h4>
                        <p className="mt-2 text-xs sm:text-sm text-muted-taupe line-clamp-2 leading-relaxed">
                          {col.shortDescription || col.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-soft-stone/60 flex items-center justify-between text-xs font-medium text-charcoal">
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
          </div>

          {/* 5. Final CTA to /shop */}
          <section className="p-8 sm:p-14 bg-pure-white rounded-card border border-soft-stone shadow-subtle text-center max-w-3xl mx-auto">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-champagne-dark font-medium block mb-2">
              Browse Without Boundaries
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal">
              Looking for our Complete Archives?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-muted-taupe leading-relaxed max-w-lg mx-auto">
              Explore the entire VELORÉ library with complete interactive filtering across notes, bottle sizes, occasions, and fragrance families.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-charcoal text-warm-ivory text-xs uppercase tracking-wider font-medium rounded-btn hover:bg-charcoal-hover transition-colors shadow-subtle"
              >
                Explore Full Shop (21 Fragrances)
              </Link>
              <Link
                href="/fragrance-finder"
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 bg-pure-white text-charcoal border border-soft-stone text-xs uppercase tracking-wider font-medium rounded-btn hover:border-champagne transition-colors shadow-subtle"
              >
                Take Olfactory Quiz
              </Link>
            </div>
          </section>
        </Container>
      </div>
    </StoreLayout>
  );
}
