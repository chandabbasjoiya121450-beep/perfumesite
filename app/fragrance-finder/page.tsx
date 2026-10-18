import React from "react";
import type { Metadata } from "next";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { FragranceQuiz } from "@/components/finder/FragranceQuiz";

export const metadata: Metadata = {
  title: "Fragrance Finder & Olfactory Discovery Quiz — VELORÉ",
  description:
    "Find your personal signature scent with the VELORÉ Fragrance Finder. Our bespoke diagnostic matches your aesthetic and rituals to rare haute parfumerie formulations.",
};

export default function FragranceFinderPage() {
  return (
    <StoreLayout>
      <FragranceQuiz />
    </StoreLayout>
  );
}
