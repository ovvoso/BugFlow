# Capture d'écran (Étape 3)

L'extension capture la **zone visible** de l'onglet courant et la conserve
temporairement, en vue de l'assemblage d'un ticket (Étape 7).

## Permissions

| Permission | Rôle |
| --- | --- |
| `activeTab` | Autorise la capture de l'onglet courant, accordée par le geste utilisateur (ouverture du popup). |
| `tabs` | Accès aux informations de l'onglet actif. |
| `storage` | Stockage de la capture (et des jetons d'auth). |

`scripting` n'est **pas** requis pour la zone visible ; il servira à une éventuelle
capture pleine page (défilement + assemblage) dans une évolution ultérieure.

## Fonctionnement

1. Dans le popup (utilisateur connecté), le bouton **« Capturer la zone visible »**
   appelle `chrome.tabs.captureVisibleTab` (format JPEG, qualité 85).
2. Le résultat (`ScreenshotCapture { dataUrl, format, capturedAt }`) est stocké dans
   `chrome.storage.session` — **en mémoire**, effacé à la fermeture du navigateur.
3. Le popup affiche un aperçu et permet d'effacer la capture.

Les pages protégées (`chrome://`, Chrome Web Store) ne sont pas capturables : une
erreur lisible est alors affichée.

## Code (Feature First — `apps/extension/src/capture/`)

- `capture.types.ts` — contrat `ScreenshotCapture` (local ; promu vers `@bugflow/types` à l'Étape 7).
- `capture.constants.ts` — format, qualité, clé de session.
- `capture.service.ts` — capture + persistance session (`storeCapture`/`getCapture`/`clearCapture`).
- `useCapture.ts` — hook React d'état (`runCapture`, `clear`).
