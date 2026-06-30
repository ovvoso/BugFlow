import type { HTMLAttributes } from "react";

/** Conteneur visuel sobre (carte). Présentation pure. */
export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps): JSX.Element {
  return (
    <div
      className={[
        "rounded-xl border border-brand-100 bg-white p-6 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
