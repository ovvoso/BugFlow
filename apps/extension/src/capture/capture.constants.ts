/** Constantes de la capture d'écran (Étape 3). */

/** Format d'encodage de la capture. */
export const SCREENSHOT_FORMAT = "jpeg";

/** Qualité JPEG (0–100) : compromis entre lisibilité et taille de stockage. */
export const SCREENSHOT_QUALITY = 85;

/**
 * Clé de stockage temporaire dans `chrome.storage.session`
 * (en mémoire, effacé à la fermeture du navigateur).
 */
export const SCREENSHOT_SESSION_KEY = "bugflow.screenshot";
