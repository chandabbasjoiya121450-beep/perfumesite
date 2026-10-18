import React from "react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";

export default function TermsPage() {
  return (
    <StoreLayout>
      <div className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Terms of Service"
            title="Terms & Conditions"
            description="Guidelines governing purchases, artisan formulation, and bespoke client orders."
            align="center"
            className="mb-12"
          />

          <Surface variant="white" radius="card" className="p-8 sm:p-10 border border-soft-stone space-y-5 text-sm text-charcoal/90 leading-relaxed">
            <h3 className="font-serif text-xl text-charcoal">1. Artisan Formulation & Batches</h3>
            <p className="text-muted-taupe">
              Because VELORÉ works with natural botanical crops, subtle variations in vintage harvests may occur between production runs. This is the hallmark of genuine artisanal perfumery.
            </p>

            <h3 className="font-serif text-xl text-charcoal">2. Orders & Verification</h3>
            <p className="text-muted-taupe">
              All client orders are subject to availability and payment confirmation. We reserve the right to decline bulk orders exceeding individual connoisseur quotas.
            </p>

            <h3 className="font-serif text-xl text-charcoal">3. Intellectual Property</h3>
            <p className="text-muted-taupe">
              All compositions, bottle designs, photography, and editorial publications remain the exclusive copyright of VELORÉ Haute Parfumerie.
            </p>
          </Surface>
        </Container>
      </div>
    </StoreLayout>
  );
}
