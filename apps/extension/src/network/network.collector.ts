/**
 * Collecte à la demande des logs réseau (Étape 6).
 *
 * Lit le tampon `window.__BUGFLOW_NETWORK__` alimenté par le content script
 * (monde MAIN), valide (frontière) et normalise via `@bugflow/shared`
 * (URL assainie), puis persiste en `chrome.storage.session`.
 */
import { networkLogsSchema, normalizeNetworkLogs } from "@bugflow/shared";
import type { NetworkLogEntry } from "@bugflow/types";

import { NETWORK_LOGS_SESSION_KEY } from "./network.constants";

/** Lecteur exécuté dans le contexte de la page (monde MAIN). */
function readNetworkBuffer(): unknown {
  return (window as { __BUGFLOW_NETWORK__?: unknown }).__BUGFLOW_NETWORK__ ?? [];
}

/** Collecte, valide, normalise et persiste les logs réseau de l'onglet actif. */
export async function collectNetworkLogs(): Promise<NetworkLogEntry[]> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("Onglet actif introuvable.");
  }

  const [injection] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: readNetworkBuffer,
  });

  const raw = networkLogsSchema.parse(injection?.result);
  const logs = normalizeNetworkLogs(raw);
  await chrome.storage.session.set({ [NETWORK_LOGS_SESSION_KEY]: logs });
  return logs;
}

/** Récupère les logs réseau stockés en session, sinon une liste vide. */
export async function getNetworkLogs(): Promise<NetworkLogEntry[]> {
  const result = await chrome.storage.session.get(NETWORK_LOGS_SESSION_KEY);
  const value = result[NETWORK_LOGS_SESSION_KEY] as NetworkLogEntry[] | undefined;
  return value ?? [];
}

/** Efface les logs réseau stockés en session. */
export async function clearNetworkLogs(): Promise<void> {
  await chrome.storage.session.remove(NETWORK_LOGS_SESSION_KEY);
}
