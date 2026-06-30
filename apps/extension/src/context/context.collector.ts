/**
 * Collecte des informations navigateur (Étape 4).
 *
 * Le contexte technique (user agent, langue, écran, viewport, URL) est lu
 * DANS la page courante via `chrome.scripting.executeScript`, puis validé
 * (frontière) et normalisé par `@bugflow/shared` avant persistance session.
 */
import { normalizeBrowserInfo, rawBrowserInfoSchema } from "@bugflow/shared";
import type { BrowserInfo } from "@bugflow/types";

import { BROWSER_INFO_SESSION_KEY } from "./context.constants";

/**
 * Fonction exécutée dans le contexte de la page (injectée).
 *
 * Doit rester autonome : pas de référence à la portée de l'extension.
 */
function readPageContext(): {
  userAgent: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  url: string;
} {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    url: window.location.href,
  };
}

/** Collecte, valide, normalise et persiste les informations navigateur. */
export async function collectBrowserInfo(): Promise<BrowserInfo> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("Onglet actif introuvable.");
  }

  const [injection] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: readPageContext,
  });

  const raw = rawBrowserInfoSchema.parse(injection?.result);
  const info = normalizeBrowserInfo(raw);
  await chrome.storage.session.set({ [BROWSER_INFO_SESSION_KEY]: info });
  return info;
}

/** Récupère les informations navigateur stockées en session, si présentes. */
export async function getBrowserInfo(): Promise<BrowserInfo | null> {
  const result = await chrome.storage.session.get(BROWSER_INFO_SESSION_KEY);
  const value = result[BROWSER_INFO_SESSION_KEY] as BrowserInfo | undefined;
  return value ?? null;
}

/** Efface les informations navigateur stockées en session. */
export async function clearBrowserInfo(): Promise<void> {
  await chrome.storage.session.remove(BROWSER_INFO_SESSION_KEY);
}
