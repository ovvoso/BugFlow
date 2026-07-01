# Logs réseau (Étape 6)

L'extension capte les **requêtes HTTP** (fetch/XHR) de la page courante, en vue
de l'assemblage d'un ticket (Étape 7).

## Ce qui est capté

Pour chaque requête (`NetworkLogEntry`) : `method`, `url` **assainie**, `status`
(`0` si la requête a échoué), `durationMs` et `startedAt` (ISO 8601).

> **Uniquement des métadonnées.** Aucun corps de requête/réponse ni en-tête
> n'est capturé.

## Filtrage des données sensibles

Avant persistance, `sanitizeUrl` masque la valeur des paramètres de requête
sensibles (`token`, `password`, `secret`, `api_key`, `auth`, `session`, `code`,
…, liste dans `SENSITIVE_QUERY_PARAMS`) par `NETWORK_REDACTED_VALUE` (`[masqué]`).
La fonction est **pure** et sans dépendance d'environnement (parsing manuel de
la query string, pas de `URL`).

## Tampon borné

Le tampon en mémoire conserve au plus **`MAX_NETWORK_LOG_SIZE` (50)** requêtes
(les plus récentes). Limite définie une seule fois dans `@bugflow/shared`.

## Architecture (monde MAIN)

Comme pour les logs JS (Étape 5), un content script s'exécute dans le **monde
MAIN** dès `document_start` :

1. `network.content.ts` (monde MAIN) enveloppe `window.fetch` et
   `XMLHttpRequest` (`open`/`send` + événement `loadend`), alimentant
   `window.__BUGFLOW_NETWORK__` (tampon borné). Aucune API `chrome.*`.
2. À la demande (bouton « Capturer »), `collectNetworkLogs` lit ce tampon via
   `chrome.scripting.executeScript({ world: "MAIN" })`, **valide**
   (`networkLogsSchema`) et **normalise** (`normalizeNetworkLogs` → URL assainie,
   tampon borné) le résultat, puis le persiste en `chrome.storage.session`.
3. Le popup affiche le nombre de requêtes et la liste (statut ≥ 400 en rouge).

## Code

### Packages partagés

- `@bugflow/types` — `NetworkLogEntry` (contrat pur).
- `@bugflow/shared` :
  - `network.constants.ts` — `MAX_NETWORK_LOG_SIZE`, `SENSITIVE_QUERY_PARAMS`, `NETWORK_REDACTED_VALUE`.
  - `network.schema.ts` — `networkLogEntrySchema` / `networkLogsSchema` (Zod).
  - `network.normalize.ts` — `sanitizeUrl`, `normalizeNetworkLogs` (fonctions pures).

### Extension (Feature First — `apps/extension/src/network/`)

- `network.content.ts` — content script monde MAIN (interception fetch/XHR + tampon).
- `network.constants.ts` — clé de session.
- `network.collector.ts` — `collectNetworkLogs` / `getNetworkLogs` / `clearNetworkLogs`.
- `useNetworkLogs.ts` — hook React d'état (`collect`, `clear`).
