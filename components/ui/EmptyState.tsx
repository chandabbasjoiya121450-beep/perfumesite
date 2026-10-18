import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  actionLabel,
  onAction,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-pure-white rounded-card border border-soft-stone max-w-lg mx-auto shadow-subtle",
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="mb-4 text-champagne w-12 h-12 flex items-center justify-center rounded-full bg-champagne-subtle border border-champagne/20">
          {icon}
        </div>
      ) : (
        <div className="mb-4 text-champagne w-12 h-12 flex items-center justify-center rounded-full bg-champagne-subtle border border-champagne/20">
          <svg
            className="w-6 h-6 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
            <path strokeLinecap="round" strokeWidth="1.5" d="M12 8v4m0 4h.01" />
          </svg>
        </div>
      )}

      <h3 className="font-serif text-2xl text-charcoal font-normal">{title}</h3>
      <p className="mt-2 text-sm text-muted-taupe max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
