/**
 * Content script (monde MAIN) — interception des logs JavaScript (Étape 5).
 *
 * Exécuté dès `document_start` dans le contexte de la page, il enveloppe
 * `console.error`/`console.warn` et écoute les erreurs non capturées
 * (`error`, `unhandledrejection`) pour alimenter un tampon en mémoire borné
 * à `MAX_LOG_SIZE`. Le popup lit ce tampon à la demande (Étape 5 : collecte).
 *
 * Aucune API `chrome.*` ici (monde MAIN) : uniquement `window`.
 */
import { MAX_LOG_MESSAGE_LENGTH, MAX_LOG_SIZE } from "@bugflow/shared";
import type { JsLogEntry, JsLogLevel } from "@bugflow/types";

declare global {
  interface Window {
    __BUGFLOW_LOGS__?: JsLogEntry[];
  }
}

function pushLog(level: JsLogLevel, message: string, source: string | null): void {
  const buffer = (window.__BUGFLOW_LOGS__ ??= []);
  buffer.push({
    level,
    message: message.slice(0, MAX_LOG_MESSAGE_LENGTH),
    source,
    timestamp: new Date().toISOString(),
  });
  if (buffer.length > MAX_LOG_SIZE) {
    buffer.splice(0, buffer.length - MAX_LOG_SIZE);
  }
}

/** Rend lisible un argument de `console.*` (objets sérialisés si possible). */
function stringifyArg(arg: unknown): string {
  if (typeof arg === "string") {
    return arg;
  }
  if (arg instanceof Error) {
    return arg.stack ?? arg.message;
  }
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

function formatArgs(args: readonly unknown[]): string {
  return args.map(stringifyArg).join(" ");
}

const originalError = console.error.bind(console);
const originalWarn = console.warn.bind(console);

console.error = (...args: unknown[]): void => {
  pushLog("error", formatArgs(args), null);
  originalError(...args);
};

console.warn = (...args: unknown[]): void => {
  pushLog("warning", formatArgs(args), null);
  originalWarn(...args);
};

window.addEventListener("error", (event) => {
  const source = event.filename
    ? `${event.filename}:${event.lineno}:${event.colno}`
    : null;
  pushLog("error", event.message, source);
});

window.addEventListener("unhandledrejection", (event) => {
  const reason: unknown = event.reason;
  const message = reason instanceof Error ? reason.message : stringifyArg(reason);
  pushLog("error", message, null);
});
