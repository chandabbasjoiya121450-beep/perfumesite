"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";

export interface AnnouncementBarProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  message = "Complimentary signature discovery vial included with every artisan order.",
  linkText = "Explore Fragrances",
  linkHref = "/shop",
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // If no message is provided or user dismissed it, do not render
  if (!message || isDismissed) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="bg-charcoal text-warm-ivory text-[11px] sm:text-xs py-2 px-4 border-b border-charcoal transition-all duration-hover"
    >
      <Container className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-sans tracking-wide">
          <span>{message}</span>
          {linkText && linkHref && (
            <a
              href={linkHref}
              className="ml-2 font-medium text-champagne hover:text-white underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
            >
              {linkText} →
            </a>
          )}
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss announcement"
          className="text-stone-400 hover:text-warm-ivory p-0.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
        >
          <svg
            className="w-3.5 h-3.5 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </Container>
    </div>
  );
};
