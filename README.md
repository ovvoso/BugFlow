# BugFlow

> **Capture intelligente de bugs et génération automatique de tickets.**

BugFlow est un produit SaaS professionnel composé d'une extension Chrome, d'un dashboard web et d'une API backend. Ce dépôt contient les **fondations** du monorepo — l'ossature technique, sans aucune fonctionnalité métier.

---

## Sommaire

- [Stack technique](#stack-technique)
- [Structure du monorepo](#structure-du-monorepo)
- [Démarrage rapide](#démarrage-rapide)
- [Scripts](#scripts)
- [Qualité & conventions](#qualité--conventions)
- [Documentation](#documentation)

---

## Stack technique

| Domaine | Technologies |
| --- | --- |
| **Extension** | React · TypeScript · Vite · Chrome Manifest V3 |
| **Dashboard** | React · TypeScript · Vite · TailwindCSS |
| **Backend** | NestJS · Prisma · PostgreSQL |
| **Monorepo** | pnpm Workspace |
| **Qualité** | ESLint · Prettier · Husky · lint-staged · commitlint |

---

## Structure du monorepo

```
bugflow/
├── apps/
│   ├── extension/      # Extension Chrome (React + Vite + MV3)
│   ├── dashboard/      # Dashboard web (React + Vite + Tailwind)
│   └── api/            # API backend (NestJS + Prisma)
│
├── packages/
│   ├── types/          # Contrats TypeScript partagés (aucun runtime)
│   ├── shared/         # Utilitaires purs (sans framework)
│   └── ui/             # Design system React partagé
│
├── docs/               # Documentation technique
├── CLAUDE.md           # Mémoire projet — à relire avant toute évolution
├── ROADMAP.md          # Feuille de route par étapes
└── package.json        # Racine du workspace
```

---

## Démarrage rapide

```bash
# 1. Installer les dépendances (active aussi les hooks Git)
pnpm install

# 2. Lancer toutes les apps en mode développement
pnpm dev
```

> Prérequis : **Node.js >= 20** et **pnpm >= 9**.

---

## Scripts

| Script | Rôle |
| --- | --- |
| `pnpm dev` | Démarre toutes les apps en parallèle |
| `pnpm build` | Construit les packages puis les apps |
| `pnpm lint` | Analyse statique (ESLint, zéro warning toléré) |
| `pnpm format` | Formatage Prettier |
| `pnpm typecheck` | Vérification des types sur tout le repo |
| `pnpm clean` | Nettoyage des builds et `node_modules` |

---

## Qualité & conventions

- **Commits** : [Conventional Commits](https://www.conventionalcommits.org) (`feat`, `fix`, `docs`…), vérifiés par commitlint.
- **Pre-commit** : lint-staged formate et lint les fichiers modifiés via Husky.
- **Zéro dépendance circulaire** : garanti par la règle ESLint `import/no-cycle`.

---

## Documentation

- [`CLAUDE.md`](./CLAUDE.md) — mémoire et règles du projet (source de vérité).
- [`ROADMAP.md`](./ROADMAP.md) — étapes de développement.
- [`docs/architecture.md`](./docs/architecture.md) — décisions d'architecture.
- [`docs/getting-started.md`](./docs/getting-started.md) — guide d'installation.

---

> ⚠️ **État actuel : fondations uniquement.** Aucune capture, aucun dashboard fonctionnel, aucune API métier, aucune authentification. Voir la roadmap pour la suite.
