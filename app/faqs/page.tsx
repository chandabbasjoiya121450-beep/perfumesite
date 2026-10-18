import React from "react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";

export default function FAQsPage() {
  const faqs = [
    {
      q: "What makes VELORÉ fragrances unique?",
      a: "Our compositions are developed in limited batches using high concentrations of pure perfume oils (Extrait de Parfum and Eau de Parfum), macerated for over 90 days to achieve unparalleled depth and longevity.",
    },
    {
      q: "How should I store my luxury perfume?",
      a: "Store your bottle in a cool, dark setting away from direct sunlight and dramatic temperature fluctuations to preserve the integrity of volatile top notes.",
    },
    {
      q: "Can I sample scents before buying a full bottle?",
      a: "Yes. Our Private Discovery Set includes five 10ml travel sprays, and every full bottle comes with a complimentary 2ml matching sample vial to test before opening.",
    },
    {
      q: "Are VELORÉ fragrances unisex?",
      a: "All VELORÉ fragrances are crafted without rigid gender boundaries, allowing the skin chemistry and individuality of the wearer to define the scent.",
    },
  ];

  return (
    <StoreLayout>
      <div className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Client Inquiries"
            title="Frequently Asked Questions"
            description="Guidance on care, formulation, sampling, and boutique ordering."
            align="center"
            className="mb-12"
          />

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Surface key={i} variant="white" radius="card" className="p-6 border border-soft-stone">
                <h3 className="font-serif text-lg text-charcoal font-normal">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-taupe leading-relaxed">{faq.a}</p>
              </Surface>
            ))}
          </div>
        </Container>
      </div>
    </StoreLayout>
  );
}
