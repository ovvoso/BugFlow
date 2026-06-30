import {
  SCREENSHOT_FORMAT,
  SCREENSHOT_QUALITY,
  SCREENSHOT_SESSION_KEY,
} from "./capture.constants";
import type { ScreenshotCapture } from "./capture.types";

/**
 * Service de capture d'écran de l'extension.
 *
 * La capture porte sur la zone VISIBLE de l'onglet actif. Elle s'appuie sur la
 * permission `activeTab`, accordée par le geste utilisateur (ouverture du popup).
 * Le résultat est conservé temporairement dans `chrome.storage.session`.
 */

/** Capture la zone visible de la fenêtre courante. */
export async function captureVisibleTab(): Promise<ScreenshotCapture> {
  const dataUrl = await chrome.tabs.captureVisibleTab({
    format: SCREENSHOT_FORMAT,
    quality: SCREENSHOT_QUALITY,
  });
  if (!dataUrl) {
    throw new Error("Capture impossible : aucune image renvoyée.");
  }
  return {
    dataUrl,
    format: SCREENSHOT_FORMAT,
    capturedAt: new Date().toISOString(),
  };
}

/** Persiste la capture dans le stockage de session. */
export async function storeCapture(capture: ScreenshotCapture): Promise<void> {
  await chrome.storage.session.set({ [SCREENSHOT_SESSION_KEY]: capture });
}

/** Restaure la capture courante, ou `null` si absente. */
export async function getCapture(): Promise<ScreenshotCapture | null> {
  const result = await chrome.storage.session.get(SCREENSHOT_SESSION_KEY);
  const value = result[SCREENSHOT_SESSION_KEY] as ScreenshotCapture | undefined;
  return value ?? null;
}

/** Efface la capture stockée. */
export async function clearCapture(): Promise<void> {
  await chrome.storage.session.remove(SCREENSHOT_SESSION_KEY);
}
