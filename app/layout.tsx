import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://velore.com"),
  title: {
    default: "VELORÉ — Luxury Fragrances. Timeless Identity.",
    template: "%s | VELORÉ Haute Parfumerie",
  },
  description:
    "Discover fragrances that express your individuality. VELORÉ is an artisan haute parfumerie creating timeless olfactory compositions crafted in Grasse and Paris.",
  keywords: [
    "luxury perfume",
    "haute parfumerie",
    "niche fragrance",
    "artisan perfume",
    "VELORÉ",
    "pure perfume extract",
    "parfum de luxe",
  ],
  authors: [{ name: "VELORÉ Haute Parfumerie" }],
  creator: "VELORÉ",
  publisher: "VELORÉ Luxury Fragrances",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://velore.com",
    siteName: "VELORÉ Haute Parfumerie",
    title: "VELORÉ — Luxury Fragrances. Timeless Identity.",
    description:
      "Artisan haute parfumerie creating timeless olfactory compositions. Explore our reserve of exquisite extraits de parfum.",
    images: [
      {
        url: "/images/products/collection-unisex.jpg",
        width: 1200,
        height: 630,
        alt: "VELORÉ Haute Parfumerie Flacons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELORÉ — Luxury Fragrances. Timeless Identity.",
    description: "Artisan haute parfumerie creating timeless olfactory compositions.",
    images: ["/images/products/collection-unisex.jpg"],
    creator: "@veloreparfums",
  },
  alternates: {
    canonical: "https://velore.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#24221F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VELORÉ",
    legalName: "VELORÉ Haute Parfumerie S.A.",
    url: "https://velore.com",
    logo: "https://velore.com/images/products/noir-1.jpg",
    description: "Artisan haute parfumerie creating timeless luxury fragrances.",
    foundingDate: "2024",
    founders: [{ "@type": "Person", name: "Eleanor Vance" }],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-835-6731",
      contactType: "Concierge Customer Support",
      email: "concierge@velore.com",
      areaServed: ["US", "FR", "GB", "AE", "JP"],
      availableLanguage: ["English", "French"],
    },
    sameAs: [
      "https://www.instagram.com/veloreparfums",
      "https://www.pinterest.com/veloreparfums",
    ],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VELORÉ",
    url: "https://velore.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://velore.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className="bg-warm-ivory text-charcoal min-h-screen flex flex-col font-sans antialiased selection:bg-champagne selection:text-white">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
