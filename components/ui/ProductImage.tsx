"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "./LoadingIndicator";

export interface ProductImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
  aspectRatio?: "4/5" | "1/1" | "3/4";
  enableHoverZoom?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className,
  fallbackText = "VELORÉ Fragrance",
  aspectRatio = "4/5",
  enableHoverZoom = true,
  priority = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const aspectStyles = {
    "4/5": "aspect-[4/5]",
    "1/1": "aspect-square",
    "3/4": "aspect-[3/4]",
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-soft-stone-subtle rounded-image border border-soft-stone/70 flex items-center justify-center",
        aspectStyles[aspectRatio]
      )}
    >
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <Skeleton radius="none" className="absolute inset-0 z-10 w-full h-full" />
      )}

      {/* Fallback state */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-pure-white">
          <div className="w-12 h-12 rounded-full border border-champagne/40 bg-champagne-subtle flex items-center justify-center mb-3 text-champagne-dark">
            <span className="font-serif text-xl font-light">V</span>
          </div>
          <span className="font-serif text-sm text-charcoal">{fallbackText}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-taupe mt-1">
            Haute Parfumerie
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt || fallbackText}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={cn(
            "object-cover object-center transition-all duration-hover ease-luxury",
            enableHoverZoom && "group-hover:scale-105",
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
};
