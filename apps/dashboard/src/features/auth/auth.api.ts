import type { LoginInput, RegisterInput } from "@bugflow/shared";
import type { AuthResult, AuthUser } from "@bugflow/types";

import { apiRequest } from "../../lib/api";

/** Appels HTTP de la feature d'authentification. */
export const authApi = {
  register: (input: RegisterInput): Promise<AuthResult> =>
    apiRequest<AuthResult>("/auth/register", { method: "POST", body: input }),

  login: (input: LoginInput): Promise<AuthResult> =>
    apiRequest<AuthResult>("/auth/login", { method: "POST", body: input }),

  /** Restaure la session à partir du cookie refresh httpOnly. */
  refresh: (): Promise<AuthResult> => apiRequest<AuthResult>("/auth/refresh", { method: "POST" }),

  logout: (accessToken: string): Promise<void> =>
    apiRequest<void>("/auth/logout", { method: "POST", accessToken }),

  me: (accessToken: string): Promise<AuthUser> => apiRequest<AuthUser>("/auth/me", { accessToken }),
};
