import { loginSchema } from "@bugflow/shared";
import { Button, Card, FormField, Input } from "@bugflow/ui";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ApiError } from "../../lib/api";

import { useAuth } from "./AuthContext";

export function LoginPage(): JSX.Element {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
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
      await login(parsed.data);
      navigate("/", { replace: true });
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Connexion impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4 font-sans">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-brand-900">Connexion</h1>
        <p className="mt-1 text-sm text-brand-700">Accédez à votre espace BugFlow.</p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
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
            <p role="alert" className="text-sm text-red-600">
              {formError}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-brand-700">
          Pas de compte ?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Créer un compte
          </Link>
        </p>
      </Card>
    </main>
  );
}
