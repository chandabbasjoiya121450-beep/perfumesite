import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import {
  COLLECTIONS,
  getCollectionBySlug,
  getProductsByCollection,
  getRelatedCollections,
} from "@/lib/data/products";
import {
  CollectionHero,
  CollectionInteractive,
  RelatedCollections,
} from "@/components/collections";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all 9 collections
export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({
    slug: c.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const collection = getCollectionBySlug(params.slug);

  if (!collection) {
    return {
      title: "Collection Not Found — VELORÉ",
    };
  }

  const title = collection.seoTitle || `${collection.title} — Curated Fragrance Collection | VELORÉ`;
  const description =
    collection.seoDescription ||
    collection.shortDescription ||
    collection.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: collection.heroImage || collection.image,
          width: 1200,
          height: 630,
          alt: collection.imageAlt || `VELORÉ ${collection.title}`,
        },
      ],
    },
    alternates: {
      canonical: `/collections/${collection.slug}`,
    },
  };
}

function CollectionSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-soft-stone">
        <div className="h-4 w-36 bg-soft-stone rounded" />
        <div className="h-9 w-44 bg-soft-stone rounded-btn" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="hidden lg:block lg:col-span-3 bg-pure-white p-6 rounded-card border border-soft-stone h-96" />
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-soft-stone/40 rounded-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CollectionDetailPage({ params }: CollectionPageProps) {
  const collection = getCollectionBySlug(params.slug);

  if (!collection) {
    notFound();
  }

  const baseProducts = getProductsByCollection(collection.slug);
  const relatedCollections = getRelatedCollections(collection.slug, 3);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url: `https://velore.com/collections/${collection.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: baseProducts.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `https://velore.com/products/${p.slug}`,
        name: p.name,
      })),
    },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://velore.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: "https://velore.com/collections",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.title,
        item: `https://velore.com/collections/${collection.slug}`,
      },
    ],
  };

  return (
    <StoreLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
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
              <li>
                <Link
                  href="/collections"
                  className="hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
                >
                  Collections
                </Link>
              </li>
              <li>/</li>
              <li className="text-charcoal font-medium" aria-current="page">
                {collection.title}
              </li>
            </ol>
          </nav>

          {/* 2. Collection Hero Banner */}
          <CollectionHero
            collection={collection}
            productCount={baseProducts.length}
          />

          {/* 3. Interactive Filtering, Sorting, Product Grid, and Pagination */}
          <Suspense fallback={<CollectionSkeleton />}>
            <CollectionInteractive
              collection={collection}
              baseProducts={baseProducts}
            />
          </Suspense>

          {/* 4. Related Collections */}
          <RelatedCollections
            collections={relatedCollections}
            allProducts={baseProducts}
          />

          {/* 5. Final CTA leading to /shop */}
          <section className="mt-16 sm:mt-20 p-8 sm:p-12 bg-soft-stone/30 rounded-card border border-soft-stone text-center max-w-3xl mx-auto">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-champagne-dark font-medium block mb-2">
              The Full Boutique Archives
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
              Seeking More Rare Compositions?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-taupe leading-relaxed max-w-lg mx-auto">
              Explore our complete catalogue of 21 artisanal extraits and eau de parfums across all fragrance families.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-8 bg-charcoal text-warm-ivory text-xs uppercase tracking-wider font-medium rounded-btn hover:bg-charcoal-hover transition-colors shadow-subtle"
              >
                Explore Full Shop
              </Link>
              <Link
                href="/fragrance-finder"
                className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 bg-pure-white text-charcoal border border-soft-stone text-xs uppercase tracking-wider font-medium rounded-btn hover:border-champagne transition-colors shadow-subtle"
              >
                Take Fragrance Quiz
              </Link>
            </div>
          </section>
        </Container>
      </div>
    </StoreLayout>
  );
}
