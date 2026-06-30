/**
 * Normalisation des informations navigateur (Étape 4).
 *
 * Fonctions pures : transforment la forme brute validée en contrat
 * `BrowserInfo` (source de vérité partagée), avec détection de l'OS.
 */
import type { BrowserInfo, OperatingSystem } from "@bugflow/types";

import type { RawBrowserInfo } from "./browser-info.schema";

/**
 * Déduit le système d'exploitation à partir du user agent.
 *
 * L'ordre des tests est important : Android contient « Linux » dans son user
 * agent, il doit donc être testé avant Linux ; iOS (iPhone/iPad/iPod) avant
 * macOS.
 */
export function detectOs(userAgent: string): OperatingSystem {
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) {
    return "Windows";
  }
  if (ua.includes("android")) {
    return "Android";
  }
  if (/iphone|ipad|ipod/.test(ua)) {
    return "iOS";
  }
  if (ua.includes("mac os") || ua.includes("macintosh")) {
    return "macOS";
  }
  if (ua.includes("linux")) {
    return "Linux";
  }
  return "Inconnu";
}

/** Construit le contrat `BrowserInfo` à partir des données brutes validées. */
export function normalizeBrowserInfo(raw: RawBrowserInfo): BrowserInfo {
  return {
    userAgent: raw.userAgent,
    os: detectOs(raw.userAgent),
    language: raw.language,
    screen: { width: raw.screenWidth, height: raw.screenHeight },
    viewport: { width: raw.viewportWidth, height: raw.viewportHeight },
    url: raw.url,
    collectedAt: new Date().toISOString(),
  };
}
