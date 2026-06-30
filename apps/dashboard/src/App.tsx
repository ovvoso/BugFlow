import { Button } from "@bugflow/ui";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { RequireAuth } from "./features/auth/RequireAuth";

/** Vue protégée provisoire (le dashboard complet arrive à l'Étape 8). */
function DashboardHome(): JSX.Element {
  const { user, logout } = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-50 font-sans text-brand-900">
      <h1 className="text-3xl font-bold">BugFlow</h1>
      <p className="text-brand-700">Connecté en tant que {user?.email}.</p>
      <Button variant="ghost" onClick={() => void logout()}>
        Se déconnecter
      </Button>
    </main>
  );
}

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <DashboardHome />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
