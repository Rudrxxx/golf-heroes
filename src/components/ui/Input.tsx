import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-carbon-300">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "bg-carbon-800 border rounded-xl px-4 py-3 text-carbon-100 placeholder-carbon-500",
            "focus:outline-none focus:ring-1 transition-colors w-full",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-carbon-600 focus:border-gold focus:ring-gold",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-carbon-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
