/**
 * Client HTTP minimal du dashboard.
 *
 * Toutes les requêtes incluent les cookies (`credentials: "include"`) afin de
 * transporter le refresh token httpOnly. L'access token est passé explicitement
 * par l'appelant (jamais persisté sur disque).
 */
const API_URL = import.meta.env.VITE_API_URL;

/** Erreur applicative portant le statut HTTP et un message lisible. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  readonly method?: string;
  readonly body?: unknown;
  readonly accessToken?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : null) ?? "Une erreur est survenue.";
    throw new ApiError(response.status, message);
  }
  return data as T;
}
