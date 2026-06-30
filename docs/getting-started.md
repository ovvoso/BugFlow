# Démarrage — BugFlow

## Prérequis

- Node.js >= 20 (voir `.nvmrc`)
- pnpm >= 9
- PostgreSQL (pour l'API, étapes ultérieures)

## Installation

```bash
pnpm install
```

L'installation déclenche `husky` (hooks Git) via le script `prepare`.

## Scripts racine

| Script | Description |
| --- | --- |
| `pnpm dev` | Lance toutes les apps en parallèle |
| `pnpm build` | Build packages puis apps |
| `pnpm lint` | ESLint sur tout le repo |
| `pnpm format` | Prettier en écriture |
| `pnpm typecheck` | Vérification de types récursive |

## Lancer une cible précise

```bash
pnpm --filter @bugflow/dashboard dev
pnpm --filter @bugflow/api dev
pnpm --filter @bugflow/extension dev
```
