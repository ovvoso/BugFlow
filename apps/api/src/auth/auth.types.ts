/** Contenu d'un access token JWT. */
export interface AccessTokenPayload {
  readonly sub: string;
  readonly email: string;
}

/** Contenu d'un refresh token JWT. */
export interface RefreshTokenPayload {
  readonly sub: string;
}

/** Utilisateur authentifié injecté dans la requête par l'access strategy. */
export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
}

/** Identité + refresh token brut, injecté dans la requête par la refresh strategy. */
export interface AuthenticatedUserWithRefresh {
  readonly id: string;
  readonly refreshToken: string;
}
