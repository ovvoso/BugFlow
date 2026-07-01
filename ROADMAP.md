# ROADMAP — BugFlow

Feuille de route découpée en **étapes indépendantes**. Chaque étape est autonome, livrable et testable séparément. **Aucune étape n'est implémentée à ce stade** : seules les fondations existent.

> Légende : ✅ terminé · 🚧 en cours · ⬜ à faire

---

## ✅ Étape 1 — Initialisation _(fondations)_

Mise en place du monorepo et de toute l'ossature technique.

- Monorepo pnpm Workspace (`apps/` + `packages/`).
- Configurations TypeScript (base + project references).
- ESLint, Prettier, Husky, lint-staged, commitlint.
- Squelettes : extension (Vite + MV3), dashboard (Vite + Tailwind), API (NestJS + Prisma).
- Packages partagés : `types`, `shared`, `ui` + preset Tailwind.
- Documentation : `README`, `CLAUDE.md`, `ROADMAP.md`, `docs/`.

**Aucune logique métier.**

---

## ✅ Étape 2 — Authentification

Gestion des comptes et des sessions.

- Modèle utilisateur (Prisma), inscription / connexion.
- Sécurisation des routes API et du dashboard.
- Stockage sécurisé du jeton côté extension.

---

## ✅ Étape 3 — Capture d'écran

Capture visuelle de la page courante.

- Permissions `activeTab` / `tabs` dans le manifest (`scripting` non requis pour la zone visible).
- Capture de la zone visible (`chrome.tabs.captureVisibleTab`, JPEG) et stockage temporaire (`chrome.storage.session`).

---

## ✅ Étape 4 — Collecte des informations navigateur

Contexte technique automatique.

- User agent, OS, résolution, URL, viewport, langue (lus dans la page via `chrome.scripting`).
- Contrats `BrowserInfo` dans `@bugflow/types` ; validation + normalisation via `@bugflow/shared`.
- Collecte déclenchée avec la capture, stockée en `chrome.storage.session`.

---

## ✅ Étape 5 — Logs JavaScript

Capture des erreurs console.

- Interception `console.error`/`console.warn` + `error`/`unhandledrejection` (content script monde MAIN).
- Mise en tampon avec limite de taille (`MAX_LOG_SIZE`) et troncature des messages.
- Contrats `JsLogEntry` dans `@bugflow/types` ; validation + normalisation via `@bugflow/shared`.

---

## ✅ Étape 6 — Logs réseau

Capture des requêtes HTTP pertinentes.

- Suivi des appels XHR/fetch (méthode, statut, durée) via content script monde MAIN.
- Métadonnées seulement (jamais de corps ni d'en-têtes) ; URL assainie (`SENSITIVE_QUERY_PARAMS`).
- Contrat `NetworkLogEntry` dans `@bugflow/types` ; validation + normalisation via `@bugflow/shared`.

---

## ⬜ Étape 7 — Création automatique de ticket

Assemblage du contexte en ticket structuré.

- Contrat `Ticket` dans `@bugflow/types`.
- Endpoint API de création, persistance Prisma.

---

## ⬜ Étape 8 — Dashboard

Interface de consultation et de gestion des tickets.

- Routing, listes, vues détail.
- Composants issus de `@bugflow/ui`.

---

## ⬜ Étape 9 — Gestion utilisateurs

Rôles, permissions et organisations.

- Rôles (admin, membre), invitations.
- Contrôle d'accès côté API et dashboard.

---

## ⬜ Étape 10 — IA

Enrichissement intelligent des tickets.

- Résumé automatique, titre suggéré, catégorisation.
- Détection de doublons.

---

## ⬜ Étape 11 — Intégrations

Connexion aux outils tiers.

- Export vers les gestionnaires de tickets externes.
- Webhooks et connecteurs configurables.

---

## ⬜ Étape 12 — Packaging

Préparation à la distribution.

- Build de production des trois apps.
- Packaging de l'extension (zip/crx), icônes, métadonnées du store.

---

## ⬜ Étape 13 — Tests

Couverture de qualité.

- Tests unitaires (packages), tests d'intégration (API).
- Tests E2E du parcours de capture.

---

## ⬜ Étape 14 — Documentation

Documentation finale produit et technique.

- Guides utilisateur et développeur.
- Documentation d'API et schémas d'architecture.

---

> **Règle d'or :** ne jamais sauter d'étape ni mélanger deux étapes dans une même livraison. Relire `CLAUDE.md` avant de commencer toute étape.

**Prochaine étape à implémenter : Étape 7 — Création automatique de ticket.**
