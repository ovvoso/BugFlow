/**
 * @bugflow/types — Point d'entrée public des contrats partagés.
 *
 * Ce package ne contient QUE des types/interfaces/enums.
 * Aucune logique d'exécution n'est autorisée ici (DRY + frontière de domaine).
 */

export type { AuthUser, AuthTokens, AuthResult } from "./auth/auth.types";
export type {
  BrowserInfo,
  Dimensions,
  OperatingSystem,
} from "./browser-info/browser-info.types";
export type { JsLogEntry, JsLogLevel } from "./logs/logs.types";
export type { NetworkLogEntry } from "./network/network.types";
