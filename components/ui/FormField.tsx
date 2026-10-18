import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  className,
  label,
  error,
  helperText,
  required,
  children,
  ...props
}) => {
  const generatedId = useId();

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      <label
        htmlFor={generatedId}
        className="block text-xs uppercase font-medium tracking-wider text-muted-taupe"
      >
        {label}
        {required && <span className="text-champagne ml-1">*</span>}
      </label>
      <div className="relative">{children}</div>
      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-muted-taupe mt-1">{helperText}</p>
      )}
    </div>
  );
};
