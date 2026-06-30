import type { AuthTokens } from "@bugflow/types";

/**
 * Stockage des jetons d'authentification de l'extension.
 *
 * Utilise `chrome.storage.local` : isolé par extension et inaccessible aux
 * pages web visitées (contrairement au localStorage d'un onglet).
 */
const TOKENS_KEY = "bugflow.authTokens";

export const tokenStorage = {
  async get(): Promise<AuthTokens | null> {
    const result = await chrome.storage.local.get(TOKENS_KEY);
    const value = result[TOKENS_KEY] as AuthTokens | undefined;
    return value ?? null;
  },

  async set(tokens: AuthTokens): Promise<void> {
    await chrome.storage.local.set({ [TOKENS_KEY]: tokens });
  },

  async clear(): Promise<void> {
    await chrome.storage.local.remove(TOKENS_KEY);
  },
};
