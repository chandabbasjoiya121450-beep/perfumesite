import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ARTICLES } from "@/lib/data/articles";

export default function JournalPage() {
  return (
    <StoreLayout>
      <div className="py-12 sm:py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Editorial & Olfactory Culture"
            title="The VELORÉ Journal"
            description="Explorations into the art of perfumery, extraction traditions, and the psychology of scent."
            align="center"
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col bg-pure-white rounded-card border border-soft-stone overflow-hidden shadow-subtle hover:shadow-card transition-all duration-hover"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
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
                    <h3 className="font-serif text-xl text-charcoal font-normal group-hover:text-champagne-dark transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-taupe leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-soft-stone flex items-center justify-between text-xs text-muted-taupe">
                    <span>{article.date}</span>
                    <span className="text-charcoal font-medium group-hover:text-champagne-dark transition-colors">
                      Read Article →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </div>
    </StoreLayout>
  );
}
