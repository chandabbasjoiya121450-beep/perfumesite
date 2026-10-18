export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export const ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "understanding-fragrance-notes",
    title: "Understanding Fragrance Notes: The Architecture of Scent",
    excerpt: "Demystifying the olfactory pyramid—how top, heart, and base notes unfold over time to create a living fragrant portrait.",
    category: "Olfactory Art",
    readTime: "4 min read",
    date: "October 14, 2026",
    image: "/images/products/brand-story-sculptural.jpg",
  },
  {
    id: "art-2",
    slug: "choosing-your-scent-family",
    title: "Woody, Floral & Fresh: Identifying Your Signature Family",
    excerpt: "A connoisseur's guide to deciphering resinous woods, precious florals, and bright citrus profiles to reflect your distinctive persona.",
    category: "Connoisseur Guide",
    readTime: "6 min read",
    date: "September 28, 2026",
    image: "/images/products/collection-unisex.jpg",
  },
  {
    id: "art-3",
    slug: "ritual-of-scent-layering",
    title: "The Subtle Ritual of Layering Pure Extraits",
    excerpt: "Techniques practiced by master perfumers to harmonize complementary accords without compromising their individual complexity.",
    category: "Atelier Secrets",
    readTime: "5 min read",
    date: "September 12, 2026",
    image: "/images/products/product-discovery-set.jpg",
  },
];
