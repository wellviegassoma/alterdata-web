'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export interface UsuarioFormState {
  error?: string;
}

function extrairMensagem(error: ApiError): string {
  const body = error.body as { message?: string | string[] } | undefined;
  if (Array.isArray(body?.message)) return body.message.join('; ');
  if (typeof body?.message === 'string') return body.message;
  return 'Erro inesperado.';
}

export async function createUsuarioAction(
  _prevState: UsuarioFormState,
  formData: FormData,
): Promise<UsuarioFormState> {
  const payload = {
    nome: String(formData.get('nome') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    senha: String(formData.get('senha') ?? ''),
    papel: String(formData.get('papel') ?? 'CONTADOR'),
  };

  if (!payload.nome || !payload.email || !payload.senha) {
    return { error: 'Preencha nome, e-mail e senha.' };
  }

  try {
    await apiFetch('/usuarios-internos', { method: 'POST', body: JSON.stringify(payload) });
  } catch (error) {
    if (error instanceof ApiError) return { error: extrairMensagem(error) };
    return { error: 'Não foi possível criar o usuário.' };
  }

  revalidatePath('/usuarios');
  redirect('/usuarios');
}

export async function updateUsuarioPapelAction(id: string, formData: FormData) {
  const papel = String(formData.get('papel') ?? '');
  await apiFetch(`/usuarios-internos/${id}`, { method: 'PATCH', body: JSON.stringify({ papel }) });
  revalidatePath('/usuarios');
}

export async function deleteUsuarioAction(id: string) {
  await apiFetch(`/usuarios-internos/${id}`, { method: 'DELETE' });
  revalidatePath('/usuarios');
}
