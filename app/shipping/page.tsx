import React from "react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";

export default function ShippingPage() {
  return (
    <StoreLayout>
      <div className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Delivery & Returns"
            title="Shipping & Returns Policy"
            description="Our commitment to prompt, temperature-controlled, insured dispatch."
            align="center"
            className="mb-12"
          />

          <div className="space-y-6">
            <Surface variant="white" radius="card" className="p-6 sm:p-8 border border-soft-stone">
              <h3 className="font-serif text-xl text-charcoal mb-2">Complimentary Courier Delivery</h3>
              <p className="text-sm text-muted-taupe leading-relaxed">
                Orders above $150 qualify for complimentary temperature-controlled courier delivery. All perfumes are packed in our signature rigid coffret boxes, cushioned with sustainable organic wool, ensuring pristine presentation upon arrival.
              </p>
            </Surface>

            <Surface variant="white" radius="card" className="p-6 sm:p-8 border border-soft-stone">
              <h3 className="font-serif text-xl text-charcoal mb-2">Try First Guarantee (Sample Policy)</h3>
              <p className="text-sm text-muted-taupe leading-relaxed">
                Every full bottle includes a matching 2ml discovery vial. Please test the miniature vial first on your skin. If the fragrance does not perfectly align with your personal style, you may return the unopened, sealed full-sized bottle within 30 days for a full refund.
              </p>
            </Surface>
          </div>
        </Container>
      </div>
    </StoreLayout>
  );
}
