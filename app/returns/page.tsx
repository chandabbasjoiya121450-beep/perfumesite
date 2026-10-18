import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Returns & Exchanges Guarantee — VELORÉ",
  description:
    "Review our 30-day Try First Guarantee policy, complimentary returns process, and unopened flacon return instructions.",
};

export default function ReturnsPage() {
  return (
    <StoreLayout>
      <div className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Client Assurance"
            title="Try First Guarantee &amp; Returns"
            description="Our thoughtful protocol ensuring you can experience every fragrance risk-free before opening the seal."
            align="center"
            className="mb-12"
          />

          <div className="space-y-6">
            <Surface variant="white" radius="card" className="p-6 sm:p-8 border border-soft-stone space-y-3">
              <div className="flex items-center gap-2 text-champagne text-xs uppercase tracking-widest font-semibold">
                <span>01</span>
                <span>The Complimentary 2ml Discovery Vial</span>
              </div>
              <h3 className="font-serif text-xl text-charcoal">Test Before You Break the Seal</h3>
              <p className="text-xs sm:text-sm text-muted-taupe leading-relaxed">
                Every full-sized VELORÉ flacon arrives paired with an identical 2ml discovery miniature outside the presentation coffret. We invite you to wear this miniature over several days to observe how the notes blossom on your pulse points.
              </p>
            </Surface>

            <Surface variant="white" radius="card" className="p-6 sm:p-8 border border-soft-stone space-y-3">
              <div className="flex items-center gap-2 text-champagne text-xs uppercase tracking-widest font-semibold">
                <span>02</span>
                <span>30-Day Return Window</span>
              </div>
              <h3 className="font-serif text-xl text-charcoal">Complimentary Domestic Returns</h3>
              <p className="text-xs sm:text-sm text-muted-taupe leading-relaxed">
                If the fragrance does not resonate with your spirit, you may return the unopened, original sealed full flacon within 30 days of courier delivery for a 100% full refund. The 2ml discovery vial is yours to keep with our compliments.
              </p>
            </Surface>

            <Surface variant="white" radius="card" className="p-6 sm:p-8 border border-soft-stone space-y-3">
              <div className="flex items-center gap-2 text-champagne text-xs uppercase tracking-widest font-semibold">
                <span>03</span>
                <span>Prepaid White-Glove Return Shipping</span>
              </div>
              <h3 className="font-serif text-xl text-charcoal">Effortless Courier Pickups</h3>
              <p className="text-xs sm:text-sm text-muted-taupe leading-relaxed">
                Initiating a return is simple. Log into your <Link href="/account" className="text-charcoal underline hover:text-champagne">Client Account</Link> or email our artisan concierge at <a href="mailto:concierge@velore.com" className="text-charcoal underline hover:text-champagne">concierge@velore.com</a>. We will dispatch a prepaid temperature-shielded courier label directly to your inbox.
              </p>
            </Surface>

            <Surface variant="white" radius="card" className="p-6 sm:p-8 border border-soft-stone space-y-3">
              <div className="flex items-center gap-2 text-champagne text-xs uppercase tracking-widest font-semibold">
                <span>04</span>
                <span>Fast Refund Processing</span>
              </div>
              <h3 className="font-serif text-xl text-charcoal">Credited to Original Method of Payment</h3>
              <p className="text-xs sm:text-sm text-muted-taupe leading-relaxed">
                Once inspected by our cellar master in Paris or New York, refunds are credited back to your original payment card within 3 to 5 business days. You will receive immediate email confirmation when the disbursement is complete.
              </p>
            </Surface>
          </div>

          <div className="mt-14 pt-8 border-t border-soft-stone text-center space-y-4">
            <h4 className="font-serif text-xl text-charcoal">
              Need Personal Assistance with an Order?
            </h4>
            <p className="text-xs text-muted-taupe">
              Our bespoke concierge team is at your disposal 7 days a week.
            </p>
            <div className="pt-2">
              <Link href="/contact">
                <Button variant="primary" size="md" pill>
                  Contact Concierge
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </StoreLayout>
  );
}
