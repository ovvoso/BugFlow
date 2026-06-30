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
