import { redirect } from 'next/navigation';
import { apiFetch, ApiError } from './api';
import type { AuthenticatedUser } from './types';

/**
 * Busca o usuário autenticado; se o token expirou (401), manda para /login.
 * O proxy só checa se o cookie de sessão existe, não se o JWT ainda é válido.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  try {
    return await apiFetch<AuthenticatedUser>('/auth/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/login');
    }
    throw error;
  }
}

/** Como requireUser, mas também exige papel ADMIN — redireciona para / se não for. */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireUser();
  if (user.papel !== 'ADMIN') {
    redirect('/');
  }
  return user;
}
