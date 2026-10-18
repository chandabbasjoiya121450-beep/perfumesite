"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Surface } from "@/components/ui/Surface";
import { Badge } from "@/components/ui/Badge";
import {
  FRAGRANCE_FAMILIES,
  getBestSellers,
  getNewArrivals,
} from "@/lib/data/products";
import { ARTICLES } from "@/lib/data/articles";

export default function HomePage() {
  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [newsletterError, setNewsletterError] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterStatus("error");
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    }, 500);
  };

  return (
    <StoreLayout showAnnouncement={true}>
      {/* =======================================================
       * 1. HERO EXPERIENCE
       * ======================================================= */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 border-b border-soft-stone">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-left z-10 animate-fade-in">
              {/* Monogram & Eyebrow */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-pill border border-soft-stone bg-pure-white/90 shadow-subtle text-[11px] uppercase tracking-widest text-muted-taupe mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                <span>Luxury Fragrances. Timeless Identity.</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-hero font-light text-charcoal leading-[1.08] tracking-tight text-balance">
                Discover Your
                <br />
                <span className="italic font-normal text-charcoal/90">
                  Signature Scent.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="mt-5 text-body text-muted-taupe leading-relaxed max-w-xl text-balance">
                Explore distinctive fragrances crafted to express your style, elevate
                your moments, and leave a lasting impression. Formulated in limited
                artisan harvests with rare botanical absolutes.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                <Link href="/shop">
                  <Button variant="primary" size="lg" pill className="px-8 shadow-card hover:shadow-hover">
                    Shop Fragrances
                  </Button>
                </Link>
                <Link href="/collections">
                  <Button variant="secondary" size="lg" pill className="px-8">
                    Explore Collections
                  </Button>
                </Link>
              </div>

              {/* Atelier Note */}
              <div className="mt-12 pt-6 border-t border-soft-stone/80 flex items-center gap-8 text-xs text-muted-taupe">
                <div>
                  <span className="block font-serif text-base text-charcoal">Pure Extraits</span>
                  <span className="text-[11px]">High Concentration</span>
                </div>
                <div className="w-[1px] h-8 bg-soft-stone" />
                <div>
                  <span className="block font-serif text-base text-charcoal">Atelier Paris</span>
                  <span className="text-[11px]">Artisan Formulation</span>
                </div>
                <div className="w-[1px] h-8 bg-soft-stone" />
                <div>
                  <span className="block font-serif text-base text-charcoal">Complimentary</span>
                  <span className="text-[11px]">2ml Discovery Vials</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Column */}
            <div className="lg:col-span-6 relative animate-fade-in-slow">
              <div className="relative aspect-[4/5] w-full max-w-lg mx-auto rounded-card overflow-hidden border border-soft-stone shadow-modal bg-pure-white">
                <Image
                  src="/images/products/elan-hero-bottle.jpg"
                  alt="VELORÉ Signature Fragrance Flacon"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-image bg-pure-white/90 backdrop-blur-md border border-soft-stone/80 shadow-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-medium">
                      Featured Harvest
                    </span>
                    <h3 className="font-serif text-lg text-charcoal font-normal">
                      Oud Royale Extrait
                    </h3>
                  </div>
                  <Link href="/products/oud-royale-01">
                    <span className="text-xs uppercase tracking-wider font-medium text-charcoal hover:text-champagne-dark underline">
                      View Creation →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =======================================================
       * 2. SHOP BY FRAGRANCE FAMILY
       * ======================================================= */}
      <section className="py-20 sm:py-28 bg-pure-white border-b border-soft-stone">
        <Container>
          <SectionHeading
            eyebrow="Curated Universes"
            title="Shop by Fragrance Family"
            description="Explore our primary scent profiles, each engineered around exceptional botanical absolutes and distinct emotional resonance."
            align="center"
            className="mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FRAGRANCE_FAMILIES.map((family) => (
              <Link
                key={family.id}
                href={`/collections/${family.slug}`}
                className="group relative flex flex-col bg-warm-ivory rounded-card border border-soft-stone overflow-hidden shadow-subtle hover:shadow-card hover:border-champagne/40 transition-all duration-hover"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-soft-stone-subtle">
                  <Image
                    src={family.image}
                    alt={family.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-hover"
                  />
                  <div className="absolute inset-0 bg-charcoal/15 group-hover:bg-charcoal/5 transition-colors" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-medium">
                      {family.count}
                    </span>
                    <h3 className="font-serif text-xl text-charcoal font-normal mt-1 group-hover:text-champagne-dark transition-colors">
                      {family.name}
                    </h3>
                    <p className="mt-2 text-xs text-muted-taupe line-clamp-2 leading-relaxed">
                      {family.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-soft-stone/60 flex items-center justify-between text-xs font-medium text-charcoal">
                    <span>Explore Collection</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* =======================================================
       * 3. BEST SELLERS SECTION
       * ======================================================= */}
      <section className="py-20 sm:py-28 border-b border-soft-stone bg-warm-ivory">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <SectionHeading
              eyebrow="Connoisseur Favorites"
              title="Best Sellers"
              description="Our most sought-after signature extraits, celebrated for enduring sillage and layered complexity."
              align="left"
              className="max-w-xl"
            />
            <Link href="/collections/best-sellers">
              <Button variant="secondary" size="md" pill className="whitespace-nowrap">
                Shop Best Sellers →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* =======================================================
       * 4. NEW ARRIVALS SECTION
       * ======================================================= */}
      <section className="py-20 sm:py-28 bg-pure-white border-b border-soft-stone">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <SectionHeading
              eyebrow="Recent Atelier Distillations"
              title="New Arrivals"
              description="Freshly matured seasonal releases highlighting rare regional harvests and modern formulations."
              align="left"
              className="max-w-xl"
            />
            <Link href="/collections/new-arrivals">
              <Button variant="secondary" size="md" pill className="whitespace-nowrap">
                Shop New Arrivals →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} priority />
            ))}
          </div>
        </Container>
      </section>

      {/* =======================================================
       * 5. BRAND STORY SECTION
       * ======================================================= */}
      <section className="py-20 sm:py-32 bg-warm-ivory border-b border-soft-stone">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Sculptural Supporting Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] w-full rounded-card overflow-hidden border border-soft-stone shadow-modal">
                <Image
                  src="/images/products/brand-story-sculptural.jpg"
                  alt="VELORÉ Sculptural Perfumery Architecture"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <span className="text-xs uppercase tracking-widest text-champagne-dark font-medium mb-3">
                The VELORÉ Philosophy
              </span>
              <h2 className="font-serif text-section font-normal text-charcoal leading-snug">
                More Than a Fragrance.
                <br />
                <span className="italic">An Identity.</span>
              </h2>

              <p className="mt-5 text-body text-muted-taupe leading-relaxed">
                Every fragrance tells a story. VELORÉ brings together distinctive
                scent profiles and considered design to help you discover a fragrance
                that feels unmistakably yours.
              </p>

              <p className="mt-4 text-body text-muted-taupe leading-relaxed">
                Rooted in French haute parfumerie heritage yet unconstrained by
                convention, our flacons are filled only after extended maceration,
                allowing botanical absolutes to deepen naturally into rich, skin-intimate
                signatures.
              </p>

              <div className="mt-8 pt-6 border-t border-soft-stone w-full">
                <Link href="/our-story">
                  <Button variant="primary" size="md" pill>
                    Discover Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =======================================================
       * 6. FRAGRANCE DISCOVERY EXPERIENCE
       * ======================================================= */}
      <section className="py-20 sm:py-28 bg-pure-white border-b border-soft-stone">
        <Container size="narrow" className="text-center">
          <SectionHeading
            eyebrow="Interactive Diagnostic"
            title="Find the Fragrance That Feels Like You"
            description="Explore scent families, moods, and fragrance notes to discover your next signature scent."
            align="center"
            className="mb-8"
          />

          <Surface variant="ivory" radius="card" className="p-8 sm:p-12 border border-soft-stone shadow-subtle text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-champagne/40 bg-champagne-subtle text-champagne-dark mb-5 font-serif text-xl">
              V
            </div>

            <p className="text-sm text-charcoal/80 max-w-md mx-auto leading-relaxed mb-6 font-sans">
              Our diagnostic guides you through preferred resinous base accords,
              blooming heart florals, and volatile top notes to present a bespoke
              fragrance match tailored to your presence.
            </p>

            <Link href="/fragrance-finder">
              <Button variant="primary" size="lg" pill className="px-8">
                Find Your Fragrance
              </Button>
            </Link>
          </Surface>
        </Container>
      </section>

      {/* =======================================================
       * 7. GIFT COLLECTION FEATURE
       * ======================================================= */}
      <section className="py-20 sm:py-28 bg-warm-ivory border-b border-soft-stone">
        <Container>
          <div className="relative rounded-card overflow-hidden border border-soft-stone shadow-card bg-pure-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest text-champagne-dark font-medium mb-3">
                  The Art of Gifting
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-snug">
                  A Fragrance Worth Remembering.
                </h2>
                <p className="mt-4 text-body text-muted-taupe leading-relaxed">
                  Discover thoughtful fragrance gifts for meaningful moments and
                  memorable occasions. Hand-poured flacons housed in rigid coffrets
                  with signature hot-stamped gold foil.
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <Link href="/collections/gifts">
                    <Button variant="primary" size="md" pill>
                      Explore Gifts
                    </Button>
                  </Link>
                  <Link href="/products/discovery-collection">
                    <Button variant="secondary" size="md" pill>
                      Discovery Set ($135)
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px]">
                <Image
                  src="/images/products/collection-exclusive.jpg"
                  alt="VELORÉ Artisan Gift Coffret"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =======================================================
       * 8. EDITORIAL OR FRAGRANCE EDUCATION FEATURE
       * ======================================================= */}
      <section className="py-20 sm:py-28 bg-pure-white border-b border-soft-stone">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <SectionHeading
              eyebrow="Olfactory Education"
              title="The Art of Fragrance"
              description="Learn to navigate complex note pyramids, sillage nuances, and the historic traditions of fine perfumery."
              align="left"
              className="max-w-xl"
            />
            <Link href="/journal">
              <Button variant="secondary" size="md" pill className="whitespace-nowrap">
                Explore Journal →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col bg-warm-ivory rounded-card border border-soft-stone overflow-hidden shadow-subtle hover:shadow-card transition-all duration-hover"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-soft-stone-subtle">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-hover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-taupe mb-2">
                      <span className="uppercase tracking-widest text-champagne-dark font-medium">
                        {article.category}
                      </span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl text-charcoal font-normal group-hover:text-champagne-dark transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-taupe line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-soft-stone flex items-center justify-between text-xs text-muted-taupe">
                    <span>{article.date}</span>
                    <Link
                      href="/journal"
                      className="text-charcoal font-medium group-hover:text-champagne-dark transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* =======================================================
       * 9. NEWSLETTER SIGNUP
       * ======================================================= */}
      <section className="py-20 sm:py-28 bg-warm-ivory border-b border-soft-stone">
        <Container size="narrow" className="text-center">
          <SectionHeading
            eyebrow="Private Dispatch"
            title="Letters from VELORÉ"
            description="Receive fragrance inspiration, new collection updates, and stories from the world of scent."
            align="center"
            className="mb-8"
          />

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterStatus === "error") setNewsletterStatus("idle");
                }}
                placeholder="Enter your email address"
                aria-label="Email for fragrance updates"
                className="w-full h-12 px-5 text-sm bg-pure-white text-charcoal placeholder:text-muted-taupe/70 rounded-input border border-soft-stone focus:border-charcoal focus:ring-1 focus:ring-champagne focus:outline-none transition-colors shadow-subtle"
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="h-12 px-8 text-xs uppercase tracking-wider font-medium text-warm-ivory bg-charcoal hover:bg-charcoal-hover rounded-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne whitespace-nowrap disabled:opacity-60 shadow-subtle"
              >
                {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {newsletterStatus === "error" && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {newsletterError}
              </p>
            )}

            {newsletterStatus === "success" && (
              <p className="text-xs text-champagne-dark mt-2 font-medium" role="status">
                ✓ Thank you for subscribing. Welcome to the VELORÉ circle. (Demo state: email integration ready)
              </p>
            )}
          </form>
        </Container>
      </section>

      {/* =======================================================
       * 10. FINAL SHOPPING CALL TO ACTION
       * ======================================================= */}
      <section className="py-20 sm:py-28 bg-pure-white border-b border-soft-stone">
        <Container size="narrow" className="text-center">
          <span className="text-xs uppercase tracking-widest text-champagne-dark font-medium mb-3 block">
            Begin Your Olfactory Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-normal leading-tight text-balance">
            Your Next Signature Scent Awaits.
          </h2>
          <p className="mt-4 text-body text-muted-taupe leading-relaxed max-w-lg mx-auto text-balance">
            Explore the VELORÉ collection and discover a fragrance that speaks to
            you. Complimentary discovery vials and insured courier delivery on all
            orders.
          </p>

          <div className="mt-8">
            <Link href="/shop">
              <Button variant="primary" size="lg" pill className="px-10 shadow-card hover:shadow-hover">
                Shop All Fragrances
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* =======================================================
       * 11. EXISTING GLOBAL FOOTER (Rendered by StoreLayout)
       * ======================================================= */}
    </StoreLayout>
  );
}
