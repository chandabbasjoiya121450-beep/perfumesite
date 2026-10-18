import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  onClear?: () => void;
  pill?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = "",
      onChange,
      onClear,
      placeholder = "Search fragrance notes, collections, or perfumers...",
      pill = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!isControlled) {
        setInternalValue(val);
      }
      onChange?.(val);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      onChange?.("");
      onClear?.();
    };

    return (
      <div className="relative w-full flex items-center">
        {/* Search icon */}
        <div className="absolute left-4 pointer-events-none text-muted-taupe">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={ref}
          type="search"
          role="searchbox"
          value={currentValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Search fragrances"
          className={cn(
            "w-full h-11 pl-11 pr-10 text-sm font-sans bg-pure-white text-charcoal placeholder:text-muted-taupe/70 border border-soft-stone transition-all duration-hover ease-luxury",
            "hover:border-soft-stone-hover focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-champagne shadow-subtle",
            pill ? "rounded-pill" : "rounded-input",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          {...props}
        />

        {/* Clear button */}
        {currentValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            className="absolute right-3.5 p-1 rounded-full text-muted-taupe hover:text-charcoal hover:bg-soft-stone transition-colors duration-micro"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
