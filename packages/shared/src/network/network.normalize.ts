/**
 * Normalisation des logs réseau (Étape 6).
 *
 * Fonctions pures : assainissent l'URL (masquage des paramètres sensibles)
 * et bornent le tampon validé au contrat partagé (`MAX_NETWORK_LOG_SIZE`).
 * Aucune dépendance à l'environnement (ni DOM, ni Node) : parsing manuel de
 * la query string via `encodeURIComponent`/`decodeURIComponent` (globaux ES).
 */
import type { NetworkLogEntry } from "@bugflow/types";

import {
  MAX_NETWORK_LOG_SIZE,
  NETWORK_REDACTED_VALUE,
  SENSITIVE_QUERY_PARAMS,
} from "./network.constants";
import type { RawNetworkLogEntry } from "./network.schema";

/** Décode un composant d'URL sans lever d'exception. */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Masque la valeur des paramètres de requête sensibles d'une URL. */
export function sanitizeUrl(rawUrl: string): string {
  const hashIndex = rawUrl.indexOf("#");
  const hash = hashIndex >= 0 ? rawUrl.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? rawUrl.slice(0, hashIndex) : rawUrl;

  const queryIndex = withoutHash.indexOf("?");
  if (queryIndex < 0) {
    return rawUrl;
  }

  const base = withoutHash.slice(0, queryIndex);
  const query = withoutHash.slice(queryIndex + 1);
  const sanitizedQuery = query
    .split("&")
    .map((pair) => {
      const eqIndex = pair.indexOf("=");
      const key = eqIndex >= 0 ? pair.slice(0, eqIndex) : pair;
      const decodedKey = safeDecode(key).toLowerCase();
      if (SENSITIVE_QUERY_PARAMS.includes(decodedKey)) {
        return `${key}=${encodeURIComponent(NETWORK_REDACTED_VALUE)}`;
      }
      return pair;
    })
    .join("&");

  return `${base}?${sanitizedQuery}${hash}`;
}

/** Borne le tampon brut au contrat `NetworkLogEntry[]` (taille + URL assainie). */
export function normalizeNetworkLogs(
  raw: readonly RawNetworkLogEntry[],
): NetworkLogEntry[] {
  return raw.slice(-MAX_NETWORK_LOG_SIZE).map((entry) => ({
    method: entry.method.toUpperCase(),
    url: sanitizeUrl(entry.url),
    status: Math.trunc(entry.status),
    durationMs: Math.round(entry.durationMs),
    startedAt: entry.startedAt,
  }));
}
