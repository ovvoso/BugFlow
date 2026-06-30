/**
 * Contrats de la fonctionnalité de capture (Étape 3).
 *
 * Type local à l'extension pour l'instant. Il sera promu vers `@bugflow/types`
 * à l'Étape 7 (ticket), lorsque l'API et le dashboard devront le partager.
 */

/** Capture de la zone visible de l'onglet courant. */
export interface ScreenshotCapture {
  /** Image encodée en data URL (`data:image/jpeg;base64,...`). */
  readonly dataUrl: string;
  /** Format de l'image (ex. "jpeg"). */
  readonly format: string;
  /** Date de capture au format ISO 8601. */
  readonly capturedAt: string;
}
