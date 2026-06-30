# Authentification (Étape 2)

Authentification par jetons JWT : un **access token** court (en mémoire / body) et
un **refresh token** persistant avec rotation. Le stockage du refresh dépend du client.

## Flux

1. **Inscription / connexion** (`POST /api/auth/register`, `POST /api/auth/login`)
   renvoient `{ user, tokens }` et posent le cookie httpOnly `bugflow_refresh_token`.
2. **Accès protégé** : l'access token est envoyé via `Authorization: Bearer <token>`.
3. **Rafraîchissement** (`POST /api/auth/refresh`) : le refresh token est lu depuis
   le cookie (web) **ou** l'en-tête Bearer (extension). De nouveaux jetons sont émis
   et le hash du refresh est remplacé en base (rotation).
4. **Déconnexion** (`POST /api/auth/logout`) : invalide le refresh stocké et efface le cookie.

## Endpoints

| Méthode | Route | Garde | Réponse |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | — | `AuthResult` (201) |
| POST | `/api/auth/login` | — | `AuthResult` (200) |
| POST | `/api/auth/refresh` | refresh token | `AuthResult` (200) |
| POST | `/api/auth/logout` | access token | — (204) |
| GET | `/api/auth/me` | access token | `AuthUser` |

## Stockage des jetons par client

- **Dashboard (web)** : access token en mémoire (jamais `localStorage`) ; refresh dans
  un cookie httpOnly. La session est restaurée au chargement via `/auth/refresh`.
- **Extension** : access et refresh tokens dans `chrome.storage.local` (isolé de
  l'extension, inaccessible aux pages visitées). Le refresh est envoyé en Bearer.

## Sécurité

- Mots de passe et refresh tokens hachés avec **argon2** ; jamais stockés en clair.
- Validation des entrées via les schémas **Zod** de `@bugflow/shared` (frontières).
- CORS restreint au dashboard et aux origines `chrome-extension://` avec `credentials`.
- En production : cookie `secure` + `sameSite=none`.

## Variables d'environnement (API)

`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_TTL` (15m), `JWT_REFRESH_TTL`
(7d), `DASHBOARD_ORIGIN`. Voir `apps/api/.env.example`.
