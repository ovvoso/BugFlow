/**
 * Contrats d'informations navigateur (Étape 4).
 *
 * Types PURS uniquement : aucune logique, aucune dépendance runtime.
 * `BrowserInfo` est la forme NORMALISÉE, prête à rejoindre un ticket (Étape 7).
 */

/** Dimensions en pixels. */
export interface Dimensions {
  readonly width: number;
  readonly height: number;
}

/** Système d'exploitation détecté à partir du user agent. */
export type OperatingSystem =
  | "Windows"
  | "macOS"
  | "Android"
  | "iOS"
  | "Linux"
  | "Inconnu";

/** Contexte technique du navigateur au moment de la capture. */
export interface BrowserInfo {
  readonly userAgent: string;
  readonly os: OperatingSystem;
  readonly language: string;
  /** Résolution de l'écran. */
  readonly screen: Dimensions;
  /** Zone visible de la page (viewport). */
  readonly viewport: Dimensions;
  readonly url: string;
  /** Date de collecte au format ISO 8601. */
  readonly collectedAt: string;
}
