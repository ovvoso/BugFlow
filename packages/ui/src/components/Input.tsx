import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

/**
 * Champ de saisie de présentation pure (aucune logique métier).
 * `hasError` ne fait que modifier l'apparence ; la validation vit ailleurs.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className = "", ...props },
  ref,
): JSX.Element {
  return (
    <input
      ref={ref}
      aria-invalid={hasError || undefined}
      className={[
        "w-full rounded-xl border bg-white px-3 py-2 text-sm text-brand-900 shadow-sm transition-colors",
        "placeholder:text-brand-500/60 focus:outline-none focus:ring-2",
        hasError
          ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
          : "border-brand-100 focus:border-brand-500 focus:ring-brand-500/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
});
