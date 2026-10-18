import React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: "ghost" | "surface" | "outline";
  size?: "sm" | "md" | "lg";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "ghost",
      size = "md",
      "aria-label": ariaLabel,
      disabled = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full transition-all duration-hover ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-warm-ivory active:scale-95 disabled:opacity-40 disabled:pointer-events-none select-none";

    const variantStyles = {
      ghost: "text-charcoal hover:bg-soft-stone/60 hover:text-charcoal-black",
      surface: "bg-pure-white text-charcoal shadow-subtle border border-soft-stone hover:border-champagne hover:shadow-card",
      outline: "border border-soft-stone text-charcoal hover:border-charcoal hover:bg-soft-stone-subtle",
    };

    const sizeStyles = {
      sm: "h-9 w-9 text-base",
      md: "h-11 w-11 text-lg",
      lg: "h-13 w-13 text-xl",
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
