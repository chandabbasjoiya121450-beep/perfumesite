import React from "react";
import { cn } from "@/lib/utils";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "ivory" | "glass" | "subtle";
  radius?: "card" | "image" | "modal" | "btn" | "pill" | "none";
  interactive?: boolean;
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      className,
      variant = "white",
      radius = "card",
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      white: "bg-pure-white border border-soft-stone shadow-card",
      ivory: "bg-warm-ivory border border-soft-stone",
      glass: "bg-warm-ivory/85 backdrop-blur-md border border-soft-stone shadow-subtle",
      subtle: "bg-soft-stone-subtle border border-soft-stone/60",
    };

    const radiusStyles = {
      card: "rounded-card",
      image: "rounded-image",
      modal: "rounded-modal",
      btn: "rounded-btn",
      pill: "rounded-pill",
      none: "rounded-none",
    };

    const interactiveStyles = interactive
      ? "transition-all duration-hover ease-luxury hover:shadow-hover hover:border-champagne/60 hover:-translate-y-0.5 cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          radiusStyles[radius],
          interactiveStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Surface.displayName = "Surface";
