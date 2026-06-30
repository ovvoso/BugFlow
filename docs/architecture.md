# Architecture — BugFlow

Ce document détaille les décisions structurelles. Il complète `CLAUDE.md` (qui fait foi).

## Vue d'ensemble

Monorepo **pnpm Workspace** organisé en deux familles :

- `apps/` — applications déployables (extension, dashboard, api)
- `packages/` — code partagé et réutilisable (types, shared, ui)

## Graphe de dépendances (sens unique, aucun cycle)

```
types  ◄── shared ◄── ui
  ▲          ▲        ▲
  └──────────┴────────┴───── apps (extension, dashboard, api)
```

Règles :

- `types` ne dépend de rien.
- `shared` ne dépend que de `types`.
- `ui` ne dépend que de `types` et `shared`.
- Les `apps` consomment les `packages`, jamais l'inverse.
- Une `app` n'importe JAMAIS une autre `app`.

La règle ESLint `import/no-cycle` verrouille l'absence de dépendances circulaires.

## Principes appliqués

SOLID · Clean Architecture · Clean Code · Feature First · DRY · KISS · Composition over Inheritance.
