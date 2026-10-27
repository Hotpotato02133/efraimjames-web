import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  rounded?: "full" | "md" | "lg";
  asChild?: boolean;
}

/**
 * Standard shadcn-inspired button component adapted to our brand palette.
 * Sizes follow the official shadcn library specifications:
 * - default: h-10 px-4 py-2 (40px)
 * - sm: h-8 px-3 text-xs (32px)
 * - lg: h-11 px-6 sm:px-8 text-sm sm:text-base (44px)
 * - icon: h-10 w-10 (40px)
 */
// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = ({
  variant = "default",
  size = "default",
  rounded = "full",
  className = "",
}: {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  rounded?: "full" | "md" | "lg";
  className?: string;
} = {}) => {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

  const variants: Record<NonNullable<typeof variant>, string> = {
    // Primary green button - aligns with our brand primary green (Header, Contact)
    default:
      "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-md hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] hover:-translate-y-0.5",
    destructive:
      "bg-red-500 text-white shadow-sm hover:bg-red-600 active:scale-[0.98] hover:-translate-y-0.5",
    outline:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] hover:-translate-y-0.5",
    secondary:
      "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 active:scale-[0.98] hover:-translate-y-0.5",
    ghost:
      "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
    link:
      "text-emerald-600 underline-offset-4 hover:underline",
  };

  const sizes: Record<NonNullable<typeof size>, string> = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-11 px-6 sm:px-8 text-sm sm:text-base",
    icon: "h-10 w-10",
  };

  const radiuses: Record<NonNullable<typeof rounded>, string> = {
    full: "rounded-full",
    md: "rounded-md",
    lg: "rounded-lg",
  };

  return cn(base, radiuses[rounded], variants[variant], sizes[size], className);
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      rounded = "full",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, rounded, className })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
