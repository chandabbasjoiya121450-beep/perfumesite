import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = "md",
  label = "Loading fragrance...",
  ...props
}) => {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-2",
    lg: "w-10 h-10 border-[2.5px]",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center gap-3", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full border-soft-stone border-t-champagne animate-spin duration-700 ease-linear",
          sizeStyles[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: "card" | "image" | "input" | "btn" | "pill" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  radius = "card",
  ...props
}) => {
  const radiusStyles = {
    card: "rounded-card",
    image: "rounded-image",
    input: "rounded-input",
    btn: "rounded-btn",
    pill: "rounded-pill",
    none: "rounded-none",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-soft-stone/50 animate-pulse",
        radiusStyles[radius],
        className
      )}
      {...props}
    />
  );
};
