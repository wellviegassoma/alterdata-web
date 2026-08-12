'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export interface GerarObrigacoesFormState {
  error?: string;
}

interface GerarResultado {
  criadas: number;
  jaExistiam: number;
  competencia: string;
}

export async function gerarObrigacoesAction(
  _prevState: GerarObrigacoesFormState,
  formData: FormData,
): Promise<GerarObrigacoesFormState> {
  const competencia = String(formData.get('competencia') ?? '').trim();
  if (!competencia) {
    return { error: 'Informe a competência.' };
  }

  let resultado: GerarResultado;
  try {
    resultado = await apiFetch<GerarResultado>('/obrigacoes-cliente/gerar', {
      method: 'POST',
      body: JSON.stringify({ competencia }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const body = error.body as { message?: string | string[] } | undefined;
      const message = Array.isArray(body?.message) ? body.message.join('; ') : body?.message;
      return { error: message ?? 'Não foi possível gerar as obrigações.' };
    }
    return { error: 'Não foi possível gerar as obrigações.' };
  }

  revalidatePath('/obrigacoes');
  redirect(
    `/obrigacoes?competencia=${resultado.competencia}&criadas=${resultado.criadas}&jaExistiam=${resultado.jaExistiam}`,
  );
}

export async function marcarCumpridaAction(id: string, cumprida: boolean) {
  await apiFetch(`/obrigacoes-cliente/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ cumprida }),
  });
  revalidatePath('/obrigacoes');
}

export async function deleteObrigacaoClienteAction(id: string) {
  await apiFetch(`/obrigacoes-cliente/${id}`, { method: 'DELETE' });
  revalidatePath('/obrigacoes');
}
