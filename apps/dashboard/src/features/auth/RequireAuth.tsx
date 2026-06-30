import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

/** Garde de route : redirige vers /login si la session n'est pas établie. */
export function RequireAuth({ children }: { readonly children: ReactNode }): JSX.Element {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-50 font-sans text-brand-700">
        Chargement…
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
