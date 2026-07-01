/**
 * @bugflow/shared — Point d'entrée public.
 *
 * Contient uniquement des fonctions PURES, des constantes et des utilitaires
 * indépendants de tout framework (ni React, ni NestJS).
 *
 * Règle : ce package ne doit JAMAIS importer @bugflow/ui (frontière respectée).
 */

export {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  NAME_MAX_LENGTH,
  REFRESH_TOKEN_COOKIE,
} from "./auth/auth.constants";
export { registerSchema, loginSchema } from "./auth/auth.schema";
export type { RegisterInput, LoginInput } from "./auth/auth.schema";
export { rawBrowserInfoSchema } from "./browser-info/browser-info.schema";
export type { RawBrowserInfo } from "./browser-info/browser-info.schema";
export {
  detectOs,
  normalizeBrowserInfo,
} from "./browser-info/browser-info.normalize";
export { MAX_LOG_SIZE, MAX_LOG_MESSAGE_LENGTH } from "./logs/logs.constants";
export { jsLogEntrySchema, jsLogsSchema } from "./logs/logs.schema";
export type { RawJsLogEntry } from "./logs/logs.schema";
export { normalizeJsLogs } from "./logs/logs.normalize";
export {
  MAX_NETWORK_LOG_SIZE,
  NETWORK_REDACTED_VALUE,
  SENSITIVE_QUERY_PARAMS,
} from "./network/network.constants";
export {
  networkLogEntrySchema,
  networkLogsSchema,
} from "./network/network.schema";
export type { RawNetworkLogEntry } from "./network/network.schema";
export {
  normalizeNetworkLogs,
  sanitizeUrl,
} from "./network/network.normalize";
