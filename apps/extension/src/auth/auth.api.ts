import type { LoginInput } from "@bugflow/shared";
import type { AuthResult, AuthUser } from "@bugflow/types";

/**
 * Appels HTTP d'authentification de l'extension.
 *
 * Pas de cookies en contexte extension : le refresh token est transmis
 * explicitement via l'en-tête `Authorization: Bearer`.
 */
const API_URL = import.meta.env.VITE_API_URL;

export class ExtensionApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ExtensionApiError";
  }
}

async function request<T>(
  path: string,
  init: { method?: string; body?: unknown; bearer?: string } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (init.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (init.bearer) {
    headers.Authorization = `Bearer ${init.bearer}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : "Une erreur est survenue.";
    throw new ExtensionApiError(response.status, message);
  }
  return data as T;
}

export const authApi = {
  login: (input: LoginInput): Promise<AuthResult> =>
    request<AuthResult>("/auth/login", { method: "POST", body: input }),

  refresh: (refreshToken: string): Promise<AuthResult> =>
    request<AuthResult>("/auth/refresh", { method: "POST", bearer: refreshToken }),

  logout: (accessToken: string): Promise<void> =>
    request<void>("/auth/logout", { method: "POST", bearer: accessToken }),

  me: (accessToken: string): Promise<AuthUser> => request<AuthUser>("/auth/me", { bearer: accessToken }),
};
