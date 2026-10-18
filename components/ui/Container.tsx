import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "full";
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  className,
  size = "default",
  as: Component = "div",
  children,
  ...props
}) => {
  const sizeStyles = {
    default: "max-w-container",
    narrow: "max-w-container-narrow",
    wide: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <Component
      className={cn(
        "w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
