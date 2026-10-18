import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftAddon,
      rightAddon,
      id,
      disabled,
      type = "text",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-wider text-muted-taupe mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-taupe">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full h-11 px-4 text-sm font-sans bg-pure-white text-charcoal placeholder:text-muted-taupe/60 rounded-input border transition-all duration-hover ease-luxury",
              "border-soft-stone hover:border-soft-stone-hover focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-champagne focus:bg-pure-white",
              "disabled:bg-soft-stone/40 disabled:cursor-not-allowed disabled:text-muted-taupe",
              leftAddon && "pl-10",
              rightAddon && "pr-10",
              error && "border-red-600 focus:border-red-600 focus:ring-red-200",
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3.5 flex items-center text-muted-taupe">
              {rightAddon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="mt-1.5 text-xs text-muted-taupe">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
