import type { NetworkLogEntry } from "@bugflow/types";
import { useEffect, useState } from "react";

import {
  clearNetworkLogs,
  collectNetworkLogs,
  getNetworkLogs,
} from "./network.collector";

interface UseNetworkLogsResult {
  readonly logs: NetworkLogEntry[];
  readonly isCollecting: boolean;
  readonly error: string | null;
  readonly collect: () => Promise<void>;
  readonly clear: () => Promise<void>;
}

/** Gère l'état des logs réseau et leur persistance temporaire. */
export function useNetworkLogs(): UseNetworkLogsResult {
  const [logs, setLogs] = useState<NetworkLogEntry[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restaurer des logs éventuellement déjà présents en session.
  useEffect(() => {
    let active = true;
    void getNetworkLogs().then((stored) => {
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
      const result = await collectNetworkLogs();
      setLogs(result);
    } catch {
      setError("Logs réseau indisponibles sur cette page.");
    } finally {
      setIsCollecting(false);
    }
  }

  async function clear(): Promise<void> {
    await clearNetworkLogs();
    setLogs([]);
    setError(null);
  }

  return { logs, isCollecting, error, collect, clear };
}
