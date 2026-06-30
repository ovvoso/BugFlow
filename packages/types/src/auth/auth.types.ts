/**
 * Contrats d'authentification partagés (Étape 2).
 *
 * Types PURS uniquement : aucune logique, aucune dépendance runtime.
 * Les types d'entrée (inscription/connexion) sont inférés des schémas Zod
 * de `@bugflow/shared` afin de garder une source de vérité unique (DRY).
 */

/** Représentation publique d'un utilisateur (jamais le hash de mot de passe). */
export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  /** Date de création au format ISO 8601. */
  readonly createdAt: string;
}

/** Couple de jetons émis par l'API. */
export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

/** Réponse renvoyée par register / login / refresh. */
export interface AuthResult {
  readonly user: AuthUser;
  readonly tokens: AuthTokens;
}
