'use server';

import { redirect } from 'next/navigation';
import { loginRequest, ApiError } from '@/lib/api';
import { setSessionToken } from '@/lib/session';

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const senha = String(formData.get('senha') ?? '');
  const redirectTo = String(formData.get('redirectTo') ?? '/');

  if (!email || !senha) {
    return { error: 'Informe e-mail e senha.' };
  }

  try {
    const { accessToken } = await loginRequest(email, senha);
    await setSessionToken(accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { error: 'E-mail ou senha inválidos.' };
    }
    return { error: 'Não foi possível conectar à API. Tente novamente.' };
  }

  redirect(redirectTo || '/');
}
