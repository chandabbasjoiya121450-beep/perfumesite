import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "warm-ivory": "#F8F7F4",
        "charcoal": {
          DEFAULT: "#24221F",
          black: "#24221F",
          hover: "#35322E",
          muted: "#4A4640",
        },
        "champagne": {
          DEFAULT: "#B69B72",
          gold: "#B69B72",
          light: "#D0BC9C",
          dark: "#987E56",
          subtle: "#F4EFEA",
        },
        "pure-white": "#FFFFFF",
        "soft-stone": {
          DEFAULT: "#EAE6DF",
          hover: "#DFDAD2",
          subtle: "#F3F1EC",
        },
        "muted-taupe": "#82786D",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        // Typography targets:
        // Hero heading: 52–76px
        "hero": ["clamp(3.25rem, 6vw, 4.75rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        // Section headings: 32–44px
        "section": ["clamp(2rem, 3.5vw, 2.75rem)", { lineHeight: "1.18", letterSpacing: "-0.01em" }],
        // Product titles: 16–20px
        "product": ["clamp(1rem, 1.25vw, 1.25rem)", { lineHeight: "1.35", letterSpacing: "0.01em" }],
        // Body text: 14–17px
        "body": ["clamp(0.875rem, 1.05vw, 1.0625rem)", { lineHeight: "1.65", letterSpacing: "0" }],
        // Secondary labels: 12–14px
        "label": ["clamp(0.75rem, 0.9vw, 0.875rem)", { lineHeight: "1.4", letterSpacing: "0.06em" }],
        // Buttons: 13–15px
        "btn": ["clamp(0.8125rem, 0.95vw, 0.9375rem)", { lineHeight: "1.2", letterSpacing: "0.08em" }],
      },
      letterSpacing: {
        tightest: "-0.025em",
        tighter: "-0.015em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.14em",
        wordmark: "0.22em",
      },
      borderRadius: {
        "card": "24px",         // Product cards: 22–28px target
        "image": "20px",        // Product image containers: 18–24px target
        "collection": "24px",   // Collection cards: 22–28px target
        "modal": "26px",        // Modals and quick-view panels: 24–28px target
        "btn": "14px",          // Buttons: 12–16px target
        "input": "14px",        // Form inputs: 12–16px target
        "pill": "9999px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      maxWidth: {
        "container": "1360px",
        "container-narrow": "880px",
      },
      boxShadow: {
        "subtle": "0 2px 8px rgba(36, 34, 31, 0.04)",
        "card": "0 4px 20px rgba(36, 34, 31, 0.05)",
        "modal": "0 20px 48px -12px rgba(36, 34, 31, 0.16)",
        "hover": "0 8px 24px rgba(36, 34, 31, 0.07)",
      },
      transitionDuration: {
        "micro": "180ms",
        "hover": "280ms",
        "modal": "300ms",
        "section": "500ms",
        "hero": "650ms",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInSlow: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-slow": "fadeInSlow 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
