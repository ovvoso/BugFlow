# Logs JavaScript (Étape 5)

L'extension capte les **erreurs et avertissements JavaScript** de la page
courante, en vue de l'assemblage d'un ticket (Étape 7).

## Ce qui est capté

| Source | Niveau |
| --- | --- |
| `console.error(...)` | `error` |
| `console.warn(...)` | `warning` |
| Erreurs non capturées (`window` événement `error`) | `error` |
| Promesses rejetées non gérées (`unhandledrejection`) | `error` |

Chaque entrée (`JsLogEntry`) contient : `level`, `message`, `source`
(`fichier:ligne:colonne` si disponible) et `timestamp` (ISO 8601).

## Tampon borné

Le tampon en mémoire conserve au plus **`MAX_LOG_SIZE` (50)** entrées (les plus
récentes) ; les messages sont tronqués à **`MAX_LOG_MESSAGE_LENGTH` (2000)**
caractères. Ces limites sont définies une seule fois dans `@bugflow/shared`.

## Architecture (monde MAIN)

Pour intercepter la console et les erreurs **de la page** (et non du monde
isolé de l'extension), un content script s'exécute dans le **monde MAIN** dès
`document_start` :

1. `logs.content.ts` (monde MAIN) enveloppe `console.error`/`console.warn` et
   écoute `error` / `unhandledrejection`, alimentant `window.__BUGFLOW_LOGS__`
   (tampon borné). Il n'utilise aucune API `chrome.*`.
2. À la demande (bouton « Capturer »), `collectJsLogs` lit ce tampon via
   `chrome.scripting.executeScript({ world: "MAIN" })`, **valide** (`jsLogsSchema`)
   et **normalise** (`normalizeJsLogs`) le résultat, puis le persiste en
   `chrome.storage.session`.
3. Le popup affiche le nombre de logs et la liste (effacée avec la capture).

## Permissions

Le content script est déclaré dans le manifest (`content_scripts`, `world:
"MAIN"`, `run_at: "document_start"`, `matches: http/https`). `scripting`
autorise la lecture à la demande du tampon.

## Code

### Packages partagés

- `@bugflow/types` — `JsLogEntry`, `JsLogLevel` (contrats purs).
- `@bugflow/shared` :
  - `logs.constants.ts` — `MAX_LOG_SIZE`, `MAX_LOG_MESSAGE_LENGTH`.
  - `logs.schema.ts` — `jsLogEntrySchema` / `jsLogsSchema` (Zod).
  - `logs.normalize.ts` — `normalizeJsLogs` (fonction pure).

### Extension (Feature First — `apps/extension/src/logs/`)

- `logs.content.ts` — content script monde MAIN (interception + tampon).
- `logs.constants.ts` — clé de session.
- `logs.collector.ts` — `collectJsLogs` / `getJsLogs` / `clearJsLogs`.
- `useJsLogs.ts` — hook React d'état (`collect`, `clear`).
