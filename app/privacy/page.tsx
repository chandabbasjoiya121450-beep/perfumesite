import React from "react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";

export default function PrivacyPage() {
  return (
    <StoreLayout>
      <div className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Legal & Security"
            title="Privacy Notice"
            description="Our steadfast dedication to safeguarding your personal information and discrete preferences."
            align="center"
            className="mb-12"
          />

          <Surface variant="white" radius="card" className="p-8 sm:p-10 border border-soft-stone space-y-5 text-sm text-charcoal/90 leading-relaxed">
            <h3 className="font-serif text-xl text-charcoal">1. Information Collection</h3>
            <p className="text-muted-taupe">
              We collect information provided directly by clients during checkout, sample requests, or private registry enrollment. This includes delivery addresses, contact details, and scent preferences.
            </p>

            <h3 className="font-serif text-xl text-charcoal">2. Data Discretion</h3>
            <p className="text-muted-taupe">
              Your details are never sold, rented, or distributed to third-party advertisers. All payment transmissions are processed using end-to-end encrypted financial gateways.
            </p>

            <h3 className="font-serif text-xl text-charcoal">3. Cookie Policy</h3>
            <p className="text-muted-taupe">
              We employ essential functional cookies solely to maintain your curated wishlist and shopping bag during your visit.
            </p>
          </Surface>
        </Container>
      </div>
    </StoreLayout>
  );
}
