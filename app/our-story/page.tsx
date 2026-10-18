import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function OurStoryPage() {
  return (
    <StoreLayout>
      <div className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="The Atelier & Philosophy"
            title="More Than a Fragrance. An Identity."
            align="center"
            className="mb-12"
          />

          <div className="relative aspect-[16/9] w-full rounded-card overflow-hidden border border-soft-stone shadow-card mb-12">
            <Image
              src="/images/products/brand-story-sculptural.jpg"
              alt="VELORÉ Artisanal Formulation"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-stone mx-auto text-charcoal/90 space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              Every fragrance tells a story. VELORÉ brings together distinctive scent profiles and considered design to help you discover a fragrance that feels unmistakably yours.
            </p>
            <p>
              Founded on the belief that personal fragrance is the most intimate expression of individuality, our atelier rejects mass-commercial blending in favor of slow, small-batch artisan maturation. Each bottle is steeped for months to allow complex absolutes to harmonize naturally.
            </p>
            <p>
              From aged Cambodi oud and Grasse centifolia roses to wild Himalayan cedar and Calabrian bergamot, our palette consists exclusively of ethically sourced, grade-A botanical essences and precious resins.
            </p>
          </div>

          <div className="mt-14 pt-8 border-t border-soft-stone text-center">
            <Link href="/shop">
              <Button variant="primary" size="md" pill>
                Explore The Compositions
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </StoreLayout>
  );
}
