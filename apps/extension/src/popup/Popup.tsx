import { loginSchema } from "@bugflow/shared";
import type { AuthUser } from "@bugflow/types";
import { Button, FormField, Input } from "@bugflow/ui";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { authApi, ExtensionApiError } from "../auth/auth.api";
import { tokenStorage } from "../auth/auth.storage";
import { useCapture } from "../capture/useCapture";
import { useBrowserInfo } from "../context/useBrowserInfo";

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
  const {
    browserInfo,
    isCollecting,
    error: browserInfoError,
    collect: collectBrowserInfo,
    clear: clearBrowserInfo,
  } = useBrowserInfo();

  const isBusy = isCapturing || isCollecting;

  async function handleCapture(): Promise<void> {
    await Promise.all([runCapture(), collectBrowserInfo()]);
  }

  async function handleClear(): Promise<void> {
    await Promise.all([clearCapture(), clearBrowserInfo()]);
  }

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

        <Button fullWidth disabled={isBusy} onClick={() => void handleCapture()}>
          {isBusy ? "Capture…" : "Capturer la zone visible"}
        </Button>

        {captureError ? (
          <p role="alert" className="text-xs text-red-600">
            {captureError}
          </p>
        ) : null}

        {browserInfoError ? (
          <p role="alert" className="text-xs text-red-600">
            {browserInfoError}
          </p>
        ) : null}

        {capture ? (
          <img
            src={capture.dataUrl}
            alt="Aperçu de la capture"
            className="w-full rounded border border-brand-100"
          />
        ) : null}

        {browserInfo ? (
          <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 rounded border border-brand-100 p-2 text-xs text-brand-700">
            <dt className="font-semibold">OS</dt>
            <dd>{browserInfo.os}</dd>
            <dt className="font-semibold">Langue</dt>
            <dd>{browserInfo.language}</dd>
            <dt className="font-semibold">Écran</dt>
            <dd>
              {browserInfo.screen.width} × {browserInfo.screen.height}
            </dd>
            <dt className="font-semibold">Viewport</dt>
            <dd>
              {browserInfo.viewport.width} × {browserInfo.viewport.height}
            </dd>
            <dt className="font-semibold">URL</dt>
            <dd className="truncate" title={browserInfo.url}>
              {browserInfo.url}
            </dd>
          </dl>
        ) : null}

        {capture || browserInfo ? (
          <Button variant="ghost" onClick={() => void handleClear()}>
            Effacer la capture
          </Button>
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
