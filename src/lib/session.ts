import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'session_token';

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

/** Só pode ser chamado em Server Actions ou Route Handlers (não em Server Components). */
export async function setSessionToken(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8h, em linha com JWT_EXPIRES_IN da API
  });
}

/** Só pode ser chamado em Server Actions ou Route Handlers (não em Server Components). */
export async function clearSessionToken() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
