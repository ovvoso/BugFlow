import type { BrowserInfo } from "@bugflow/types";
import { useEffect, useState } from "react";

import {
  clearBrowserInfo,
  collectBrowserInfo,
  getBrowserInfo,
} from "./context.collector";

interface UseBrowserInfoResult {
  readonly browserInfo: BrowserInfo | null;
  readonly isCollecting: boolean;
  readonly error: string | null;
  readonly collect: () => Promise<void>;
  readonly clear: () => Promise<void>;
}

/** Gère l'état des informations navigateur et leur persistance temporaire. */
export function useBrowserInfo(): UseBrowserInfoResult {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restaurer des informations éventuellement déjà présentes en session.
  useEffect(() => {
    let active = true;
    void getBrowserInfo().then((stored) => {
      if (active) {
        setBrowserInfo(stored);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function collect(): Promise<void> {
    setError(null);
    setIsCollecting(true);
    try {
      const result = await collectBrowserInfo();
      setBrowserInfo(result);
    } catch {
      setError("Informations navigateur indisponibles sur cette page.");
    } finally {
      setIsCollecting(false);
    }
  }

  async function clear(): Promise<void> {
    await clearBrowserInfo();
    setBrowserInfo(null);
    setError(null);
  }

  return { browserInfo, isCollecting, error, collect, clear };
}
