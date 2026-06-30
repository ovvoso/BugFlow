import type { ReactNode } from "react";

/**
 * Groupe label + contrôle + message d'erreur (présentation pure, a11y).
 * Le `htmlFor`/`id` relie le label au contrôle ; l'erreur est annoncée via aria.
 */
export interface FormFieldProps {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps): JSX.Element {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-brand-900">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
