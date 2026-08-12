'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export interface AcessoClienteFormState {
  error?: string;
}

export async function createAcessoClienteAction(
  clienteId: string,
  cnpjCpf: string,
  _prevState: AcessoClienteFormState,
  formData: FormData,
): Promise<AcessoClienteFormState> {
  const portal = String(formData.get('portal') ?? '').trim();
  const login = String(formData.get('login') ?? '').trim();
  const senha = String(formData.get('senha') ?? '').trim();
  const observacoes = String(formData.get('observacoes') ?? '').trim();

  if (!portal || !senha) {
    return { error: 'Informe ao menos o portal e a senha.' };
  }

  try {
    await apiFetch('/acessos-cliente', {
      method: 'POST',
      body: JSON.stringify({
        clienteId,
        portal,
        login: login || undefined,
        senha,
        observacoes: observacoes || undefined,
      }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const body = error.body as { message?: string | string[] } | undefined;
      const message = Array.isArray(body?.message) ? body.message.join('; ') : body?.message;
      return { error: message ?? 'Não foi possível salvar o acesso.' };
    }
    return { error: 'Não foi possível salvar o acesso.' };
  }

  revalidatePath(`/clientes/${cnpjCpf}`);
  return {};
}

export async function deleteAcessoClienteAction(id: string, cnpjCpf: string) {
  await apiFetch(`/acessos-cliente/${id}`, { method: 'DELETE' });
  revalidatePath(`/clientes/${cnpjCpf}`);
}

/** Chamada direto por um Client Component (sem form) só quando o usuário clica em "Mostrar". */
export async function revelarSenhaAction(id: string): Promise<string> {
  const { senha } = await apiFetch<{ senha: string }>(`/acessos-cliente/${id}/revelar`);
  return senha;
}
