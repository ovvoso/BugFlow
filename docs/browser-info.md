# Informations navigateur (Étape 4)

L'extension collecte le **contexte technique** de l'onglet courant en même temps
que la capture d'écran, en vue de l'assemblage d'un ticket (Étape 7).

## Données collectées

| Champ | Source (dans la page) |
| --- | --- |
| `userAgent` | `navigator.userAgent` |
| `os` | déduit du user agent (`detectOs`) |
| `language` | `navigator.language` |
| `screen` | `window.screen.width` / `height` |
| `viewport` | `window.innerWidth` / `innerHeight` |
| `url` | `window.location.href` |
| `collectedAt` | horodatage ISO 8601 à la collecte |

## Permissions

`scripting` est ajoutée pour **injecter** le collecteur dans la page via
`chrome.scripting.executeScript` : cela garantit un viewport et une URL fidèles
au contexte de l'onglet (et non à celui du popup). `activeTab` autorise cette
injection sur l'onglet courant suite au geste utilisateur.

## Fonctionnement

1. Le bouton **« Capturer la zone visible »** déclenche en parallèle la capture
   d'écran (Étape 3) et la collecte des informations navigateur.
2. `collectBrowserInfo` :
   - récupère l'onglet actif (`chrome.tabs.query`) ;
   - injecte un lecteur autonome dans la page (`executeScript`) ;
   - **valide** le résultat brut (`rawBrowserInfoSchema`, validation aux frontières) ;
   - **normalise** vers le contrat `BrowserInfo` (`normalizeBrowserInfo`, détection OS) ;
   - persiste dans `chrome.storage.session` (effacé à la fermeture du navigateur).
3. Le popup affiche OS, langue, écran, viewport et URL ; « Effacer » efface la
   capture **et** les informations navigateur.

## Code

### Packages partagés

- `@bugflow/types` — `BrowserInfo`, `Dimensions`, `OperatingSystem` (contrats purs).
- `@bugflow/shared` :
  - `browser-info.schema.ts` — `rawBrowserInfoSchema` / `RawBrowserInfo` (Zod).
  - `browser-info.normalize.ts` — `normalizeBrowserInfo`, `detectOs` (fonctions pures).

### Extension (Feature First — `apps/extension/src/context/`)

- `context.constants.ts` — clé de session.
- `context.collector.ts` — `collectBrowserInfo` / `getBrowserInfo` / `clearBrowserInfo`.
- `useBrowserInfo.ts` — hook React d'état (`collect`, `clear`).

## Détection de l'OS

`detectOs` teste le user agent dans cet ordre : Windows → Android → iOS →
macOS → Linux → `Inconnu`. Android est testé **avant** Linux (son user agent
contient « Linux »), iOS **avant** macOS.
