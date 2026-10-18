import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Maison VELORÉ — Haute Parfumerie & Heritage",
  description:
    "Learn about Maison VELORÉ, our artisanal philosophy, botanical absolutes from Grasse, and our commitment to slow perfumery.",
};

export default function AboutPage() {
  return (
    <StoreLayout>
      <div className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Maison VELORÉ"
            title="The Art of Slow Perfumery"
            description="Born from an obsession with raw botanicals, timeless formulation, and intimate olfactory memory."
            align="center"
            className="mb-12"
          />

          <div className="relative aspect-[16/9] w-full rounded-card overflow-hidden border border-soft-stone shadow-card mb-12">
            <Image
              src="/images/products/brand-story-sculptural.jpg"
              alt="Maison VELORÉ Atelier Formulation"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-stone mx-auto text-charcoal/90 space-y-6 text-sm sm:text-base leading-relaxed font-sans">
            <p>
              At Maison VELORÉ, we view haute parfumerie not merely as an accessory, but as an invisible architecture of personal identity. Established between the flower fields of Grasse and our creative atelier in Paris, VELORÉ creates compositions that balance classical French mastery with contemporary architectural minimalism.
            </p>

            <h3 className="font-serif text-2xl text-charcoal font-normal pt-4">
              Ethical Sourcing &amp; Rare Absolutes
            </h3>
            <p>
              Our master perfumers reject synthetic uniformity. Each vintage is formulated in strictly limited botanical harvests: hand-picked Centifolia roses harvested at dawn, ethically extracted sustainably-farmed Oud from South Asia, Haitian vetiver roots washed and distilled with ancient copper stills, and aged Tahitian vanilla beans macerated in pure organic alcohol.
            </p>

            <h3 className="font-serif text-2xl text-charcoal font-normal pt-4">
              Months of Maceration
            </h3>
            <p>
              Commercial fragrances are rushed to shelves within days of mixing. VELORÉ extraits de parfum mature in temperature-regulated dark casks for a minimum of 120 days. This slow aging process—known in French as <em>le repos</em>—allows natural esters and resins to weave together seamlessly, resulting in unmatched longevity and multidimensional sillage that evolves with skin temperature over 16+ hours.
            </p>

            <div className="my-10 p-6 sm:p-8 bg-pure-white rounded-card border border-soft-stone space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block">
                The VELORÉ Atelier Code
              </span>
              <ul className="text-xs sm:text-sm text-muted-taupe space-y-2 list-disc pl-5">
                <li>100% cruelty-free, sustainable packaging crafted from recycled Italian glass.</li>
                <li>Pure Extrait concentration (25% to 32% aromatic oil load).</li>
                <li>Complimentary 2ml discovery vial accompanying every flacon to sample before opening.</li>
                <li>Zero artificial colorants, phthalates, parabens, or synthetic stabilizers.</li>
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-soft-stone text-center space-y-4">
            <h4 className="font-serif text-xl text-charcoal">
              Begin Your Olfactory Discovery
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/shop">
                <Button variant="primary" size="md" pill>
                  Explore Fragrances
                </Button>
              </Link>
              <Link href="/fragrance-finder">
                <Button variant="secondary" size="md" pill>
                  Take Fragrance Quiz
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </StoreLayout>
  );
}
