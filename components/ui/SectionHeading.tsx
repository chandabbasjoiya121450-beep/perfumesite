import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  as?: "h1" | "h2" | "h3";
  isHero?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  className,
  eyebrow,
  title,
  description,
  align = "center",
  as: Component = "h2",
  isHero = false,
  ...props
}) => {
  const alignmentStyles = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn("flex flex-col max-w-2xl", alignmentStyles[align], className)}
      {...props}
    >
      {eyebrow && (
        <span className="text-xs uppercase font-medium tracking-widest text-champagne mb-3 block">
          {eyebrow}
        </span>
      )}
      <Component
        className={cn(
          "font-serif font-normal text-charcoal",
          isHero
            ? "text-hero leading-tight"
            : "text-section leading-snug tracking-tight"
        )}
      >
        {title}
      </Component>
      {description && (
        <p className="mt-3.5 text-body text-muted-taupe leading-relaxed max-w-prose text-balance font-sans">
          {description}
        </p>
      )}
    </div>
  );
};
