import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "dark" | "subtle";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans uppercase font-medium rounded-pill tracking-widest transition-colors select-none";

  const variantStyles = {
    default: "bg-soft-stone-subtle text-charcoal border border-soft-stone",
    accent: "bg-champagne-subtle text-champagne-dark border border-champagne/30",
    dark: "bg-charcoal text-warm-ivory border border-charcoal",
    subtle: "bg-pure-white text-muted-taupe border border-soft-stone shadow-subtle",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2.5 py-0.5",
    md: "text-[11px] px-3.5 py-1",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
