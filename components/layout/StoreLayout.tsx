"use client";

import React from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useStore } from "@/context/StoreContext";
import { SearchOverlay, QuickViewModal } from "@/components/search";
import { CartDrawer } from "@/components/cart/CartDrawer";

export interface StoreLayoutProps {
  children: React.ReactNode;
  showAnnouncement?: boolean;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({
  children,
  showAnnouncement = true,
}) => {
  const { openSearch } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory text-charcoal">
      {/* Skip to Content Accessibility Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-charcoal focus:text-warm-ivory focus:rounded-btn"
      >
        Skip to main content
      </a>

      {showAnnouncement && <AnnouncementBar />}
      <Header onSearchClick={openSearch} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />

      {/* Global Interactive Overlays */}
      <SearchOverlay />
      <QuickViewModal />
      <CartDrawer />
    </div>
  );
};
