import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "default" | "muted" | "accent";
  underline?: boolean;
}

export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    {
      href,
      className,
      variant = "default",
      underline = true,
      children,
      ...props
    },
    ref
  ) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");

    const variantStyles = {
      default: "text-charcoal hover:text-champagne-dark",
      muted: "text-muted-taupe hover:text-charcoal",
      accent: "text-champagne hover:text-champagne-dark",
    };

    const underlineStyles = underline
      ? "relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-hover after:ease-luxury hover:after:w-full"
      : "";

    const combinedClassName = cn(
      "inline-flex items-center text-sm font-medium transition-colors duration-hover ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 rounded-sm",
      variantStyles[variant],
      underlineStyles,
      className
    );

    if (isInternal) {
      return (
        <Link ref={ref} href={href} className={combinedClassName} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        className={combinedClassName}
        target={props.target || "_blank"}
        rel={props.rel || "noopener noreferrer"}
        {...props}
      >
        {children}
      </a>
    );
  }
);

TextLink.displayName = "TextLink";
