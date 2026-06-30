import { loginSchema } from "@bugflow/shared";
import type { AuthUser } from "@bugflow/types";
import { Button, FormField, Input } from "@bugflow/ui";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { authApi, ExtensionApiError } from "../auth/auth.api";
import { tokenStorage } from "../auth/auth.storage";
import { useCapture } from "../capture/useCapture";

/** Popup de l'extension : connexion et état de session (Étape 2). */
export function Popup(): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { capture, isCapturing, error: captureError, runCapture, clear: clearCapture } = useCapture();

  // Au montage : restaurer la session depuis les jetons stockés.
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const tokens = await tokenStorage.get();
        if (!tokens) {
          return;
        }
        try {
          const me = await authApi.me(tokens.accessToken);
          if (active) {
            setUser(me);
          }
        } catch {
          const refreshed = await authApi.refresh(tokens.refreshToken);
          await tokenStorage.set(refreshed.tokens);
          if (active) {
            setUser(refreshed.user);
          }
        }
      } catch {
        await tokenStorage.clear();
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({ email: flat.email?.[0], password: flat.password?.[0] });
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const result = await authApi.login(parsed.data);
      await tokenStorage.set(result.tokens);
      setUser(result.user);
      setEmail("");
      setPassword("");
    } catch (error) {
      setFormError(error instanceof ExtensionApiError ? error.message : "Connexion impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout(): Promise<void> {
    const tokens = await tokenStorage.get();
    if (tokens) {
      await authApi.logout(tokens.accessToken).catch(() => undefined);
    }
    await tokenStorage.clear();
    setUser(null);
  }

  if (loading) {
    return (
      <div className="w-72 p-4 font-sans text-sm text-brand-700">Chargement…</div>
    );
  }

  if (user) {
    return (
      <div className="flex w-72 flex-col gap-3 p-4 font-sans text-brand-900">
        <h1 className="text-lg font-bold">BugFlow</h1>
        <p className="text-sm text-brand-700">Connecté : {user.email}</p>

        <Button fullWidth disabled={isCapturing} onClick={() => void runCapture()}>
          {isCapturing ? "Capture…" : "Capturer la zone visible"}
        </Button>

        {captureError ? (
          <p role="alert" className="text-xs text-red-600">
            {captureError}
          </p>
        ) : null}

        {capture ? (
          <div className="flex flex-col gap-2">
            <img
              src={capture.dataUrl}
              alt="Aperçu de la capture"
              className="w-full rounded border border-brand-100"
            />
            <Button variant="ghost" onClick={() => void clearCapture()}>
              Effacer la capture
            </Button>
          </div>
        ) : null}

        <Button variant="ghost" onClick={() => void handleLogout()}>
          Se déconnecter
        </Button>
      </div>
    );
  }

  return (
    <div className="w-72 p-4 font-sans text-brand-900">
      <h1 className="text-lg font-bold">BugFlow</h1>
      <p className="mt-1 text-sm text-brand-700">Connectez-vous pour signaler des bugs.</p>

      <form className="mt-4 flex flex-col gap-3" onSubmit={handleLogin} noValidate>
        <FormField id="email" label="Email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            hasError={Boolean(fieldErrors.email)}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>

        <FormField id="password" label="Mot de passe" error={fieldErrors.password}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            hasError={Boolean(fieldErrors.password)}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>

        {formError ? (
          <p role="alert" className="text-xs text-red-600">
            {formError}
          </p>
        ) : null}

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
