/**
 * Contrats des logs JavaScript (Étape 5).
 *
 * Types PURS uniquement : aucune logique, aucune dépendance runtime.
 * Une entrée représente une erreur ou un avertissement capté dans la page,
 * en vue de l'assemblage d'un ticket (Étape 7).
 */

/** Niveau d'un log JavaScript capté. */
export type JsLogLevel = "error" | "warning";

/** Entrée de log JavaScript normalisée. */
export interface JsLogEntry {
  readonly level: JsLogLevel;
  readonly message: string;
  /** Origine `fichier:ligne:colonne` si disponible, sinon `null`. */
  readonly source: string | null;
  /** Date de l'événement au format ISO 8601. */
  readonly timestamp: string;
}
