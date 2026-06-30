/**
 * Constantes d'authentification partagées (Étape 2).
 *
 * Source unique de vérité pour les règles de validation et les en-têtes,
 * réutilisée par l'API, le dashboard et l'extension (DRY).
 */

/** Longueur minimale d'un mot de passe. */
export const PASSWORD_MIN_LENGTH = 8;

/** Longueur maximale d'un mot de passe (borne défensive). */
export const PASSWORD_MAX_LENGTH = 128;

/** Longueur maximale d'un nom affiché. */
export const NAME_MAX_LENGTH = 80;

/** Nom du cookie httpOnly portant le refresh token (clients web). */
export const REFRESH_TOKEN_COOKIE = "bugflow_refresh_token";
