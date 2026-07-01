/** Constantes de capture des logs réseau (Étape 6). */

/** Nombre maximal de requêtes conservées dans le tampon (les plus récentes). */
export const MAX_NETWORK_LOG_SIZE = 50;

/** Valeur de remplacement des paramètres d'URL sensibles. */
export const NETWORK_REDACTED_VALUE = "[masqué]";

/** Paramètres de requête (query string) considérés comme sensibles. */
export const SENSITIVE_QUERY_PARAMS: readonly string[] = [
  "token",
  "access_token",
  "refresh_token",
  "password",
  "pwd",
  "secret",
  "api_key",
  "apikey",
  "key",
  "auth",
  "authorization",
  "session",
  "sessionid",
  "code",
];
