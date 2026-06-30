import { useEffect, useState } from "react";

import {
  captureVisibleTab,
  clearCapture,
  getCapture,
  storeCapture,
} from "./capture.service";
import type { ScreenshotCapture } from "./capture.types";

interface UseCaptureResult {
  readonly capture: ScreenshotCapture | null;
  readonly isCapturing: boolean;
  readonly error: string | null;
  readonly runCapture: () => Promise<void>;
  readonly clear: () => Promise<void>;
}

/** Gère l'état de la capture d'écran et sa persistance temporaire. */
export function useCapture(): UseCaptureResult {
  const [capture, setCapture] = useState<ScreenshotCapture | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restaurer une capture éventuellement déjà présente en session.
  useEffect(() => {
    let active = true;
    void getCapture().then((stored) => {
      if (active) {
        setCapture(stored);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function runCapture(): Promise<void> {
    setError(null);
    setIsCapturing(true);
    try {
      const result = await captureVisibleTab();
      await storeCapture(result);
      setCapture(result);
    } catch {
      setError("Capture impossible. Cette page ne peut pas être capturée.");
    } finally {
      setIsCapturing(false);
    }
  }

  async function clear(): Promise<void> {
    await clearCapture();
    setCapture(null);
    setError(null);
  }

  return { capture, isCapturing, error, runCapture, clear };
}
