/**
 * Content script (monde MAIN) — interception des requêtes réseau (Étape 6).
 *
 * Exécuté dès `document_start` dans le contexte de la page, il enveloppe
 * `window.fetch` et `XMLHttpRequest` pour consigner les requêtes (méthode,
 * URL, statut, durée) dans un tampon en mémoire borné à `MAX_NETWORK_LOG_SIZE`.
 * Seules des métadonnées sont conservées : jamais de corps ni d'en-têtes.
 * Le popup lit ce tampon à la demande.
 *
 * Aucune API `chrome.*` ici (monde MAIN) : uniquement `window`.
 */
import { MAX_NETWORK_LOG_SIZE } from "@bugflow/shared";
import type { NetworkLogEntry } from "@bugflow/types";

declare global {
  interface Window {
    __BUGFLOW_NETWORK__?: NetworkLogEntry[];
  }
}

function pushEntry(entry: NetworkLogEntry): void {
  const buffer = (window.__BUGFLOW_NETWORK__ ??= []);
  buffer.push(entry);
  if (buffer.length > MAX_NETWORK_LOG_SIZE) {
    buffer.splice(0, buffer.length - MAX_NETWORK_LOG_SIZE);
  }
}

const originalFetch = window.fetch.bind(window);

window.fetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const startedAt = new Date().toISOString();
  const start = performance.now();
  const method = (
    init?.method ?? (input instanceof Request ? input.method : "GET")
  ).toUpperCase();
  const url = input instanceof Request ? input.url : String(input);
  try {
    const response = await originalFetch(input, init);
    pushEntry({
      method,
      url,
      status: response.status,
      durationMs: performance.now() - start,
      startedAt,
    });
    return response;
  } catch (error) {
    pushEntry({ method, url, status: 0, durationMs: performance.now() - start, startedAt });
    throw error;
  }
};

interface XhrMeta {
  method: string;
  url: string;
  startedAt: string;
  start: number;
}

const xhrMeta = new WeakMap<XMLHttpRequest, XhrMeta>();
const originalOpen = XMLHttpRequest.prototype.open as (
  this: XMLHttpRequest,
  method: string,
  url: string | URL,
  async: boolean,
  username?: string | null,
  password?: string | null,
) => void;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (
  this: XMLHttpRequest,
  method: string,
  url: string | URL,
  async: boolean = true,
  username?: string | null,
  password?: string | null,
): void {
  xhrMeta.set(this, {
    method: method.toUpperCase(),
    url: String(url),
    startedAt: "",
    start: 0,
  });
  originalOpen.call(this, method, url, async, username, password);
};

XMLHttpRequest.prototype.send = function (
  this: XMLHttpRequest,
  body?: Document | XMLHttpRequestBodyInit | null,
): void {
  const meta = xhrMeta.get(this);
  if (meta) {
    meta.startedAt = new Date().toISOString();
    meta.start = performance.now();
    this.addEventListener("loadend", () => {
      pushEntry({
        method: meta.method,
        url: meta.url,
        status: this.status,
        durationMs: performance.now() - meta.start,
        startedAt: meta.startedAt,
      });
    });
  }
  originalSend.call(this, body ?? null);
};
