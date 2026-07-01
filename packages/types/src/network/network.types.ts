/**
 * Contrats des logs réseau (Étape 6).
 *
 * Types PURS uniquement : aucune logique, aucune dépendance runtime.
 * Une entrée résume une requête HTTP (XHR/fetch) observée dans la page :
 * métadonnées seulement (jamais de corps ni d'en-têtes), en vue de
 * l'assemblage d'un ticket (Étape 7).
 */

/** Requête HTTP observée (métadonnées non sensibles). */
export interface NetworkLogEntry {
  readonly method: string;
  /** URL assainie (paramètres sensibles masqués). */
  readonly url: string;
  /** Code HTTP, ou `0` si la requête a échoué (réseau/CORS). */
  readonly status: number;
  /** Durée de la requête en millisecondes. */
  readonly durationMs: number;
  /** Date de début au format ISO 8601. */
  readonly startedAt: string;
}
