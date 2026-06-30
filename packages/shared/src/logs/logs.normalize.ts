/**
 * Normalisation des logs JavaScript (Étape 5).
 *
 * Fonctions pures : bornent le tampon validé au contrat partagé
 * (`MAX_LOG_SIZE` entrées les plus récentes, messages tronqués).
 */
import type { JsLogEntry } from "@bugflow/types";

import { MAX_LOG_MESSAGE_LENGTH, MAX_LOG_SIZE } from "./logs.constants";
import type { RawJsLogEntry } from "./logs.schema";

/** Borne le tampon brut au contrat `JsLogEntry[]` (taille + longueur message). */
export function normalizeJsLogs(raw: readonly RawJsLogEntry[]): JsLogEntry[] {
  return raw.slice(-MAX_LOG_SIZE).map((entry) => ({
    level: entry.level,
    message: entry.message.slice(0, MAX_LOG_MESSAGE_LENGTH),
    source: entry.source,
    timestamp: entry.timestamp,
  }));
}
