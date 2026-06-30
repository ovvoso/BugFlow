import type { LoginInput, RegisterInput } from "@bugflow/shared";
import type { AuthUser } from "@bugflow/types";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { authApi } from "./auth.api";

interface AuthContextValue {
  readonly user: AuthUser | null;
  readonly isLoading: boolean;
  readonly login: (input: LoginInput) => Promise<void>;
  readonly register: (input: RegisterInput) => Promise<void>;
  readonly logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Source de vérité de la session côté dashboard.
 * L'access token reste EN MÉMOIRE (jamais localStorage) ; le refresh token
 * vit dans un cookie httpOnly géré par l'API.
 */
export function AuthProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au montage : tenter de restaurer la session via le cookie refresh.
  useEffect(() => {
    let active = true;
    authApi
      .refresh()
      .then((result) => {
        if (active) {
          setUser(result.user);
          setAccessToken(result.tokens.accessToken);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setAccessToken(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const result = await authApi.login(input);
    setUser(result.user);
    setAccessToken(result.tokens.accessToken);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const result = await authApi.register(input);
    setUser(result.user);
    setAccessToken(result.tokens.accessToken);
  }, []);

  const logout = useCallback(async () => {
    if (accessToken) {
      await authApi.logout(accessToken).catch(() => undefined);
    }
    setUser(null);
    setAccessToken(null);
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider.");
  }
  return context;
}
