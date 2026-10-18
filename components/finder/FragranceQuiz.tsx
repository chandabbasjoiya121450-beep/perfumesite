"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, Product } from "@/lib/data/products";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface QuizAnswers {
  persona: string;
  family: string;
  occasion: string;
  intensity: string;
  season: string;
}

interface ScoredProduct {
  product: Product;
  score: number;
  matchReasons: string[];
}

const QUESTIONS = [
  {
    id: "persona",
    title: "How would you describe your presence and atmosphere?",
    subtitle: "Select the mood that most closely reflects your inner aesthetic or the impression you wish to leave.",
    options: [
      {
        id: "mysterious",
        label: "Mysterious & Enigmatic",
        description: "Shadowed woods, dark amber, leather, and smoke that evoke nocturnal intrigue.",
        familyHint: "woody",
        keywords: ["oud", "smoke", "leather", "dark", "amber", "nocturnal"],
      },
      {
        id: "radiant",
        label: "Radiant & Solar",
        description: "Effervescent citrus, Mediterranean neroli, and crisp crystalline breezes.",
        familyHint: "fresh",
        keywords: ["citrus", "neroli", "bergamot", "solar", "fresh", "sparkling"],
      },
      {
        id: "sensual",
        label: "Sensual & Enveloping",
        description: "Sumptuous Madagascar vanilla, golden labdanum, and velvety tonka beans.",
        familyHint: "amber-oriental",
        keywords: ["vanilla", "labdanum", "tonka", "warm", "golden", "amber"],
      },
      {
        id: "poetic",
        label: "Opulent & Poetic Floral",
        description: "Centifolia rose, Florentine orris, and night-blooming white petals in harmonic bloom.",
        familyHint: "floral",
        keywords: ["rose", "iris", "jasmine", "floral", "petals", "orris"],
      },
      {
        id: "understated",
        label: "Architectural & Understated",
        description: "Clean Virginia cedar, white tea, dry iris, and tailored, contemporary minimalism.",
        familyHint: "woody",
        keywords: ["cedar", "clean", "minimal", "sandalwood", "dry", "crisp"],
      },
    ],
  },
  {
    id: "family",
    title: "Which fragrance family draws your senses most naturally?",
    subtitle: "The heart of your olfactory wardrobe is rooted in primary accords.",
    options: [
      {
        id: "woody",
        label: "Noble Woods & Resins",
        description: "Rare Mysore sandalwood, ancient Cambodian oud, Haitian vetiver, and smoky cedar.",
        family: "woody",
      },
      {
        id: "fresh",
        label: "Fresh, Citrus & Solar",
        description: "Calabrian bergamot, orange blossom, crisp marine ozone, and bright aromatics.",
        family: "fresh",
      },
      {
        id: "amber-oriental",
        label: "Amber & Exotic Orientals",
        description: "Balsamic benzoin tears, golden ambergris, bourbon vanilla, and spiced saffron.",
        family: "amber-oriental",
      },
      {
        id: "floral",
        label: "Heirloom & Nocturnal Florals",
        description: "Grasse velvet rose, powdery iris, white tuberose, and delicate neroli blossom.",
        family: "floral",
      },
      {
        id: "open",
        label: "Open to Discovery",
        description: "Surprise my senses based on my lifestyle and preferred intensity.",
        family: "any",
      },
    ],
  },
  {
    id: "occasion",
    title: "When will you most often wear this fragrance?",
    subtitle: "A fragrance is an invisible garment tailored for specific rituals and moments.",
    options: [
      {
        id: "everyday",
        label: "Everyday Signature & Professional",
        description: "Refined daily wear for work, creative studios, and effortless personal distinction.",
        tag: "Everyday Signature",
      },
      {
        id: "evening",
        label: "Formal Galas & Midnight Soirées",
        description: "Dramatic evening occasions, opera nights, black-tie dinners, and celebrations.",
        tag: "Evening & Occasion",
      },
      {
        id: "intimate",
        label: "Intimate Evenings & Close Encounters",
        description: "Sensory closeness, candlelit dinners, and private personal presence.",
        tag: "Date Night",
      },
      {
        id: "travel",
        label: "Sunlit Escapes & Weekend Travel",
        description: "Coastal getaways, terrace afternoons, and spirited daytime adventures.",
        tag: "Spring",
      },
    ],
  },
  {
    id: "intensity",
    title: "What is your preferred sillage and intensity?",
    subtitle: "From an intimate whisper only revealed up close, to a commanding room presence.",
    options: [
      {
        id: "subtle",
        label: "Subtle & Intimate (Skin Scent)",
        description: "A delicate aura that whispers softly, inviting those who step into your immediate radius.",
        matchIntensity: ["Eau de Parfum"],
      },
      {
        id: "moderate",
        label: "Balanced & Radiating",
        description: "An elegant, noticeable trail with 8-10 hours of refined projection throughout the day.",
        matchIntensity: ["Eau de Parfum", "Extrait de Parfum"],
      },
      {
        id: "commanding",
        label: "Extrait Intense & Commanding",
        description: "High oil concentration (30%+), commanding sillage, and 14+ hours of lasting luxury.",
        matchIntensity: ["Extrait de Parfum", "Extrait Intense"],
      },
    ],
  },
  {
    id: "season",
    title: "What climate or season are you curating for?",
    subtitle: "Fragrance evolves differently depending on ambient temperature and humidity.",
    options: [
      {
        id: "autumn-winter",
        label: "Autumn & Winter Chill",
        description: "Deep, enveloping notes that warm crisp air and pair gracefully with cashmere and wool.",
        seasons: ["Autumn", "Winter"],
      },
      {
        id: "spring-summer",
        label: "Spring & Summer Heat",
        description: "Airy, sparkling, and cooling notes that radiate vividly in sunlit warmth.",
        seasons: ["Spring", "Summer"],
      },
      {
        id: "all-season",
        label: "Year-Round Trans-seasonal",
        description: "A balanced composition formulated to flourish gracefully across all 365 days.",
        seasons: ["All Season", "All Year"],
      },
    ],
  },
];

export function FragranceQuiz() {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [stage, setStage] = useState<"intro" | "quiz" | "results">("intro");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    persona: "",
    family: "",
    occasion: "",
    intensity: "",
    season: "",
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleStart = () => {
    setStage("quiz");
    setCurrentStep(0);
  };

  const handleSelectOption = (field: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setStage("results");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setStage("intro");
    }
  };

  const handleSkip = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setStage("results");
    }
  };

  const handleReset = () => {
    setAnswers({
      persona: "",
      family: "",
      occasion: "",
      intensity: "",
      season: "",
    });
    setStage("intro");
    setCurrentStep(0);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2500);
  };

  // Algorithmic calculation of matches
  const calculateScores = (): ScoredProduct[] => {
    return PRODUCTS.map((product) => {
      let score = 55; // baseline luxury score
      const matchReasons: string[] = [];

      // 1. Family Match (max +22)
      if (answers.family && answers.family !== "any") {
        if (product.fragranceFamily.toLowerCase() === answers.family.toLowerCase()) {
          score += 22;
          matchReasons.push(`Harmonizes with your preferred ${product.family} family.`);
        }
      } else {
        score += 15;
      }

      // 2. Persona / Keywords Match (max +15)
      const personaQuestion = QUESTIONS[0];
      const selectedPersonaOption = personaQuestion.options.find(
        (o) => o.id === answers.persona
      );
      if (selectedPersonaOption && "keywords" in selectedPersonaOption) {
        const keywords = (selectedPersonaOption as any).keywords as string[];
        const textToSearch = `${product.description} ${product.topNotes.join(" ")} ${product.heartNotes.join(" ")} ${product.baseNotes.join(" ")}`.toLowerCase();
        let keywordHits = 0;
        keywords.forEach((kw) => {
          if (textToSearch.includes(kw.toLowerCase())) {
            keywordHits++;
          }
        });
        if (keywordHits >= 2) {
          score += 15;
          matchReasons.push(`Reflects your ${selectedPersonaOption.label.toLowerCase()} aesthetic.`);
        } else if (keywordHits === 1) {
          score += 8;
        }
      }

      // 3. Occasion Match (max +10)
      if (answers.occasion) {
        const occasionOpt = QUESTIONS[2].options.find((o) => o.id === answers.occasion) as any;
        if (occasionOpt && occasionOpt.tag) {
          const matchTag = product.occasionTags.some(
            (t) =>
              t.toLowerCase().includes(occasionOpt.tag.toLowerCase()) ||
              occasionOpt.tag.toLowerCase().includes(t.toLowerCase())
          );
          if (matchTag) {
            score += 10;
            matchReasons.push(`Formulated for ${occasionOpt.label.toLowerCase()}.`);
          }
        }
      }

      // 4. Intensity Match (max +8)
      if (answers.intensity) {
        const intensityOpt = QUESTIONS[3].options.find((o) => o.id === answers.intensity) as any;
        if (intensityOpt && intensityOpt.matchIntensity) {
          if (intensityOpt.matchIntensity.includes(product.intensity || "")) {
            score += 8;
            matchReasons.push(`Delivers your desired ${intensityOpt.label.toLowerCase()} projection.`);
          }
        }
      }

      // 5. Season Match (max +8)
      if (answers.season) {
        const seasonOpt = QUESTIONS[4].options.find((o) => o.id === answers.season) as any;
        if (seasonOpt && seasonOpt.seasons) {
          const matchesSeason = product.seasonTags.some((st) =>
            seasonOpt.seasons.includes(st)
          );
          if (matchesSeason || product.seasonTags.includes("All Season")) {
            score += 8;
            matchReasons.push(`Calibrated for ${seasonOpt.label.toLowerCase()}.`);
          }
        }
      }

      // Cap score cleanly at 98% (luxury modesty) and floor at 76%
      const finalScore = Math.min(98, Math.max(76, score));

      if (matchReasons.length === 0) {
        matchReasons.push(`Masterfully balanced with ${product.topNotes[0]} and ${product.baseNotes[0]}.`);
      }

      return {
        product,
        score: finalScore,
        matchReasons,
      };
    }).sort((a, b) => b.score - a.score);
  };

  const results = stage === "results" ? calculateScores() : [];
  const primaryMatch = results[0];
  const complementaryMatches = results.slice(1, 4);

  return (
    <div className="py-12 sm:py-16 md:py-20 min-h-[70vh]">
      <Container>
        {/* STAGE: INTRO */}
        {stage === "intro" && (
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-champagne/40 bg-champagne/10 text-champagne text-xs uppercase tracking-widest font-medium">
              <span>Haute Parfumerie Diagnostic</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-charcoal leading-tight tracking-tight">
              Find Your Signature Scent
            </h1>

            <p className="text-muted-taupe text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Discover fragrances that reflect your preferences, your mood, and the moments that matter to you. Through five bespoke olfactory inquiries, our algorithm uncovers the VELORÉ composition most intimately aligned with your presence.
            </p>

            {/* Three Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
              <div className="bg-pure-white p-6 rounded-card border border-soft-stone/80 shadow-subtle">
                <span className="text-champagne font-serif text-2xl font-light block mb-2">01</span>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal mb-2">
                  Atmospheric Aura
                </h2>
                <p className="text-xs text-muted-taupe leading-relaxed">
                  Identify the spatial presence and aesthetic aura you desire to embody.
                </p>
              </div>

              <div className="bg-pure-white p-6 rounded-card border border-soft-stone/80 shadow-subtle">
                <span className="text-champagne font-serif text-2xl font-light block mb-2">02</span>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal mb-2">
                  Olfactory Notes
                </h2>
                <p className="text-xs text-muted-taupe leading-relaxed">
                  Pinpoint raw botanical accords, rare resinous woods, and intoxicating florals.
                </p>
              </div>

              <div className="bg-pure-white p-6 rounded-card border border-soft-stone/80 shadow-subtle">
                <span className="text-champagne font-serif text-2xl font-light block mb-2">03</span>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal mb-2">
                  Precision Sillage
                </h2>
                <p className="text-xs text-muted-taupe leading-relaxed">
                  Calibrate personal longevity and concentration to fit your distinct lifestyle.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center justify-center px-10 py-4 bg-charcoal text-pure-white text-sm font-medium tracking-widest uppercase hover:bg-champagne hover:text-charcoal transition-all duration-300 shadow-md group"
              >
                <span>Start Your Discovery</span>
                <svg
                  className="w-4 h-4 ml-3 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <p className="text-[11px] text-muted-taupe mt-3 uppercase tracking-wider">
                Takes approximately 2 minutes &bull; Completely personalized
              </p>
            </div>
          </div>
        )}

        {/* STAGE: QUIZ */}
        {stage === "quiz" && (
          <div className="max-w-3xl mx-auto">
            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs tracking-wider text-muted-taupe uppercase mb-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-charcoal hover:text-champagne transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
                <span className="font-medium text-charcoal">
                  Question {currentStep + 1} of {QUESTIONS.length}
                </span>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-muted-taupe hover:text-charcoal transition-colors"
                >
                  Skip
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-soft-stone h-1 rounded-full overflow-hidden">
                <div
                  className="bg-champagne h-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Heading */}
            <div className="text-center mb-10">
              <span className="text-[11px] uppercase tracking-widest text-champagne font-medium block mb-2">
                Diagnostic Step {currentStep + 1}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal mb-3">
                {QUESTIONS[currentStep].title}
              </h2>
              <p className="text-sm text-muted-taupe max-w-xl mx-auto">
                {QUESTIONS[currentStep].subtitle}
              </p>
            </div>

            {/* Options Cards */}
            <div className="grid grid-cols-1 gap-4 mb-10">
              {QUESTIONS[currentStep].options.map((option) => {
                const isSelected =
                  answers[QUESTIONS[currentStep].id as keyof QuizAnswers] === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      handleSelectOption(QUESTIONS[currentStep].id as keyof QuizAnswers, option.id)
                    }
                    className={`p-6 rounded-card text-left transition-all duration-300 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                      isSelected
                        ? "border-champagne bg-warm-ivory shadow-subtle ring-1 ring-champagne"
                        : "border-soft-stone bg-pure-white hover:border-champagne/60 hover:shadow-subtle"
                    }`}
                  >
                    <div className="flex-1">
                      <h3
                        className={`text-base font-serif mb-1 group-hover:text-champagne transition-colors ${
                          isSelected ? "text-charcoal font-semibold" : "text-charcoal font-normal"
                        }`}
                      >
                        {option.label}
                      </h3>
                      <p className="text-xs text-muted-taupe leading-relaxed">
                        {option.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-champagne bg-champagne text-pure-white"
                            : "border-soft-stone group-hover:border-champagne"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE: RESULTS */}
        {stage === "results" && primaryMatch && (
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Results Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-champagne/40 bg-champagne/10 text-champagne text-xs uppercase tracking-widest font-medium">
                <span>Olfactory Match Confirmed</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">
                Your Curated Signature Scent
              </h1>
              <p className="text-sm text-muted-taupe max-w-xl mx-auto">
                Based on your presence, aesthetic preferences, and ritual requirements, our algorithm has tailored these exceptional formulations from the VELORÉ reserve.
              </p>
            </div>

            {/* Primary Match Spotlight Card */}
            <div className="bg-pure-white rounded-card border border-soft-stone overflow-hidden shadow-subtle p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                {/* Product Image Column */}
                <div className="md:col-span-5 relative">
                  <div className="aspect-[3/4] relative rounded-card overflow-hidden bg-soft-stone/40">
                    <Image
                      src={primaryMatch.product.images[0] || primaryMatch.product.image}
                      alt={primaryMatch.product.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-4 left-4 bg-charcoal/90 backdrop-blur-sm text-warm-ivory text-xs px-3 py-1.5 tracking-wider uppercase font-medium rounded-sm">
                      {primaryMatch.score}% Compatibility
                    </div>
                  </div>
                </div>

                {/* Product Narrative Column */}
                <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-taupe uppercase tracking-widest mb-2">
                      <span className="text-champagne font-semibold">Primary Signature Match</span>
                      <span>{primaryMatch.product.family}</span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mb-2">
                      {primaryMatch.product.name}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-muted-taupe mb-4">
                      {primaryMatch.product.subtitle} &bull; {primaryMatch.product.size}
                    </p>

                    <p className="text-sm text-muted-taupe leading-relaxed mb-6">
                      {primaryMatch.product.description}
                    </p>

                    {/* Algorithmic Rationale Box */}
                    <div className="bg-warm-ivory/60 border border-soft-stone rounded-sm p-4 mb-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Why this matches your aura</span>
                      </h3>
                      <ul className="text-xs text-muted-taupe space-y-1.5 list-disc list-inside">
                        {primaryMatch.matchReasons.map((reason, idx) => (
                          <li key={idx} className="leading-snug">
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pyramid Highlights */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-soft-stone text-center mb-6">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-muted-taupe">Top Accord</span>
                        <span className="block text-xs font-medium text-charcoal mt-0.5 truncate">
                          {primaryMatch.product.topNotes[0]}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-muted-taupe">Heart Note</span>
                        <span className="block text-xs font-medium text-charcoal mt-0.5 truncate">
                          {primaryMatch.product.heartNotes[0]}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-muted-taupe">Base Note</span>
                        <span className="block text-xs font-medium text-charcoal mt-0.5 truncate">
                          {primaryMatch.product.baseNotes[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-2xl font-serif text-charcoal font-medium">
                        ${primaryMatch.product.price}
                      </span>
                      <span className="text-xs text-muted-taupe">Complimentary signature gift box & samples</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(primaryMatch.product)}
                        className={`w-full py-3.5 px-6 text-xs font-medium uppercase tracking-widest transition-all duration-300 text-center ${
                          addedProductId === primaryMatch.product.id
                            ? "bg-green-700 text-pure-white"
                            : "bg-charcoal text-pure-white hover:bg-champagne hover:text-charcoal"
                        }`}
                      >
                        {addedProductId === primaryMatch.product.id ? "Added to Bag" : "Add to Bag"}
                      </button>

                      <Link
                        href={`/products/${primaryMatch.product.slug}`}
                        className="w-full py-3.5 px-6 text-xs font-medium uppercase tracking-widest border border-charcoal text-charcoal hover:bg-charcoal hover:text-pure-white transition-all duration-300 text-center"
                      >
                        Explore Fragrance Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complementary Recommendations */}
            {complementaryMatches.length > 0 && (
              <div className="space-y-8 pt-8 border-t border-soft-stone">
                <div className="text-center">
                  <span className="text-xs uppercase tracking-widest text-champagne font-medium block mb-1">
                    Olfactory Nuances
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
                    Complementary Explorations
                  </h3>
                  <p className="text-xs text-muted-taupe mt-1 max-w-lg mx-auto">
                    Should you desire an alternative shade of character, these selections represent closely aligned harmonious options.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {complementaryMatches.map(({ product, score }) => (
                    <div
                      key={product.id}
                      className="bg-pure-white border border-soft-stone rounded-card overflow-hidden flex flex-col justify-between shadow-subtle group hover:border-champagne/60 transition-all duration-300"
                    >
                      <div>
                        <div className="aspect-[4/5] relative bg-soft-stone/30 overflow-hidden">
                          <Image
                            src={product.images[0] || product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <span className="absolute top-3 left-3 bg-charcoal/90 text-warm-ivory text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm">
                            {score}% Match
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-pure-white/90 backdrop-blur-sm flex items-center justify-center text-charcoal hover:text-champagne transition-colors"
                            aria-label="Wishlist"
                          >
                            <svg
                              className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-champagne text-champagne" : "fill-none"}`}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="p-5">
                          <span className="text-[10px] uppercase tracking-widest text-muted-taupe block mb-1">
                            {product.family}
                          </span>
                          <Link href={`/products/${product.slug}`}>
                            <h4 className="font-serif text-lg text-charcoal group-hover:text-champagne transition-colors mb-1">
                              {product.name}
                            </h4>
                          </Link>
                          <p className="text-xs text-muted-taupe line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          <div className="text-xs text-charcoal font-medium font-serif">
                            ${product.price}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="py-2.5 px-3 bg-warm-ivory border border-soft-stone text-[11px] uppercase tracking-wider text-charcoal hover:bg-charcoal hover:text-pure-white transition-colors text-center"
                        >
                          Add to Bag
                        </button>
                        <Link
                          href={`/products/${product.slug}`}
                          className="py-2.5 px-3 bg-pure-white border border-soft-stone text-[11px] uppercase tracking-wider text-charcoal hover:border-champagne hover:text-champagne transition-colors text-center"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-soft-stone">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal text-charcoal text-xs uppercase tracking-widest hover:bg-charcoal hover:text-pure-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Retake Consultation</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 bg-warm-ivory border border-soft-stone text-charcoal text-xs uppercase tracking-widest hover:border-champagne transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>{copiedLink ? "Diagnostic Link Copied!" : "Share Diagnostic"}</span>
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
