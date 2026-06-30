/**
 * Collecte à la demande des logs JavaScript (Étape 5).
 *
 * Lit le tampon `window.__BUGFLOW_LOGS__` alimenté par le content script
 * (monde MAIN), valide (frontière) et normalise via `@bugflow/shared`, puis
 * persiste en `chrome.storage.session`.
 */
import { jsLogsSchema, normalizeJsLogs } from "@bugflow/shared";
import type { JsLogEntry } from "@bugflow/types";

import { JS_LOGS_SESSION_KEY } from "./logs.constants";

/** Lecteur exécuté dans le contexte de la page (monde MAIN). */
function readLogBuffer(): unknown {
  return (window as { __BUGFLOW_LOGS__?: unknown }).__BUGFLOW_LOGS__ ?? [];
}

/** Collecte, valide, normalise et persiste les logs JS de l'onglet actif. */
export async function collectJsLogs(): Promise<JsLogEntry[]> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("Onglet actif introuvable.");
  }

  const [injection] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: readLogBuffer,
  });

  const raw = jsLogsSchema.parse(injection?.result);
  const logs = normalizeJsLogs(raw);
  await chrome.storage.session.set({ [JS_LOGS_SESSION_KEY]: logs });
  return logs;
}

/** Récupère les logs JS stockés en session, sinon une liste vide. */
export async function getJsLogs(): Promise<JsLogEntry[]> {
  const result = await chrome.storage.session.get(JS_LOGS_SESSION_KEY);
  const value = result[JS_LOGS_SESSION_KEY] as JsLogEntry[] | undefined;
  return value ?? [];
}

/** Efface les logs JS stockés en session. */
export async function clearJsLogs(): Promise<void> {
  await chrome.storage.session.remove(JS_LOGS_SESSION_KEY);
}
