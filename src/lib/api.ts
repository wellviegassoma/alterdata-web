import { getSessionToken } from './session';

const API_URL = process.env.API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
  }
}

/**
 * Fetch autenticado para a alterdata-api, usado em Server Components/Actions.
 * Anexa o Bearer token da sessão automaticamente.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getSessionToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new ApiError(response.status, `Falha na API (${response.status})`, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/** Chamada de login não autenticada (sem cookie ainda). */
export async function loginRequest(email: string, senha: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
    cache: 'no-store',
  });

  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(response.status, body?.message ?? 'Falha no login', body);
  }

  return body as {
    accessToken: string;
    usuario: { id: string; nome: string; email: string; papel: string };
  };
}
