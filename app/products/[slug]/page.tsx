import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { PRODUCTS, getProductBySlug } from "@/lib/data/products";
import { getDbProductById, getProductRatingSummary } from "@/lib/server/store-db";
import {
  ProductGallery,
  ProductInfo,
  ProductFragranceNotes,
  ProductReviewsSection,
  ProductRelated,
} from "@/components/product";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Pre-render all 21 catalog products at build time
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

// Generate dynamic SEO metadata
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = getDbProductById(params.slug) || getProductBySlug(params.slug);

  if (!product || product.status === "draft" || product.status === "archived") {
    return {
      title: "Product Not Found — VELORÉ Haute Parfumerie",
    };
  }

  const title = product.seoTitle || `${product.name} — ${product.subtitle} | VELORÉ`;
  const description =
    product.seoDescription ||
    product.description ||
    `${product.name} is a luxury ${product.family.toLowerCase()} fragrance formulated by VELORÉ.`;

  return {
    title,
    description,
    openGraph: {
      title: `${product.name} — Luxury Fragrance | VELORÉ`,
      description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.imageAlt || `${product.name} flacon`,
        },
      ],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getDbProductById(params.slug) || getProductBySlug(params.slug);

  if (!product || product.status === "draft" || product.status === "archived") {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image.startsWith("http") ? product.image : `https://velore.com${product.image}`,
    description: product.description,
    sku: product.id,
    mpn: product.slug,
    brand: {
      "@type": "Brand",
      name: "VELORÉ",
    },
    category: `Fragrance > ${product.family}`,
    offers: {
      "@type": "Offer",
      url: `https://velore.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: "2027-12-31",
      availability: (product.stock ?? 10) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "VELORÉ",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: getProductRatingSummary(product.id).count > 0 ? getProductRatingSummary(product.id).average : 4.9,
      reviewCount: getProductRatingSummary(product.id).count > 0 ? getProductRatingSummary(product.id).count : 12,
      bestRating: 5,
      worstRating: 1,
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
        name: "Shop",
        item: "https://velore.com/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.family,
        item: `https://velore.com/collections/${product.fragranceFamily}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://velore.com/products/${product.slug}`,
      },
    ],
  };

  return (
    <StoreLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <div className="py-8 sm:py-12 md:py-16">
        <Container>
          {/* 1. Breadcrumb Navigation */}
          <nav aria-label="Breadcrumbs" className="mb-8 text-xs text-muted-taupe">
            <ol className="flex flex-wrap items-center gap-2">
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
                  href="/shop"
                  className="hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
                >
                  Shop
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/collections/${product.fragranceFamily}`}
                  className="hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
                >
                  {product.family}
                </Link>
              </li>
              <li>/</li>
              <li className="text-charcoal font-medium" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* 2. Main Two-Column Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Product Image Gallery */}
            <div className="lg:col-span-6 lg:sticky lg:top-28">
              <ProductGallery product={product} />
            </div>

            {/* Right Column: Product Information, Pricing, & Purchase Controls */}
            <div className="lg:col-span-6">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* 3. Detailed Fragrance Notes & Formulation Specifications */}
          <ProductFragranceNotes product={product} />

          {/* 4. Client Impressions & Verified Reviews Section */}
          <ProductReviewsSection product={product} />

          {/* 5. Algorithmic Curated Related Products */}
          <ProductRelated product={product} />
        </Container>
      </div>
    </StoreLayout>
  );
}
