import type { JsLogEntry } from "@bugflow/types";
import { useEffect, useState } from "react";

import { clearJsLogs, collectJsLogs, getJsLogs } from "./logs.collector";

interface UseJsLogsResult {
  readonly logs: JsLogEntry[];
  readonly isCollecting: boolean;
  readonly error: string | null;
  readonly collect: () => Promise<void>;
  readonly clear: () => Promise<void>;
}

/** Gère l'état des logs JavaScript et leur persistance temporaire. */
export function useJsLogs(): UseJsLogsResult {
  const [logs, setLogs] = useState<JsLogEntry[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restaurer des logs éventuellement déjà présents en session.
  useEffect(() => {
    let active = true;
    void getJsLogs().then((stored) => {
      if (active) {
        setLogs(stored);
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
      const result = await collectJsLogs();
      setLogs(result);
    } catch {
      setError("Logs JavaScript indisponibles sur cette page.");
    } finally {
      setIsCollecting(false);
    }
  }

  async function clear(): Promise<void> {
    await clearJsLogs();
    setLogs([]);
    setError(null);
  }

  return { logs, isCollecting, error, collect, clear };
}
