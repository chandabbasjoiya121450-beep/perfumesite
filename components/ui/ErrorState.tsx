import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  className,
  title = "An Unexpected Interruption Occurred",
  message = "We were unable to load the requested fragrance archives. Please verify your connection or attempt once more.",
  retryLabel = "Attempt Again",
  onRetry,
  ...props
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-pure-white rounded-card border border-soft-stone max-w-lg mx-auto shadow-subtle",
        className
      )}
      {...props}
    >
      <div className="mb-4 text-charcoal w-12 h-12 flex items-center justify-center rounded-full bg-soft-stone/50 border border-soft-stone">
        <svg
          className="w-5 h-5 text-muted-taupe"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="font-serif text-2xl text-charcoal font-normal">{title}</h3>
      <p className="mt-2 text-sm text-muted-taupe max-w-sm leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
