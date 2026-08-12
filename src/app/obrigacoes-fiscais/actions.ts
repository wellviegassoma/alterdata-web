'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export interface TipoObrigacaoFiscalFormState {
  error?: string;
}

export async function createTipoObrigacaoFiscalAction(
  _prevState: TipoObrigacaoFiscalFormState,
  formData: FormData,
): Promise<TipoObrigacaoFiscalFormState> {
  const nome = String(formData.get('nome') ?? '').trim();
  const periodicidade = String(formData.get('periodicidade') ?? '').trim();
  const diaVencimentoRaw = String(formData.get('diaVencimento') ?? '').trim();
  const mesVencimentoRaw = String(formData.get('mesVencimento') ?? '').trim();
  const regimesAplicaveis = formData.getAll('regimesAplicaveis').map(String);

  if (!nome || !periodicidade || !diaVencimentoRaw) {
    return { error: 'Informe nome, periodicidade e dia de vencimento.' };
  }
  if (periodicidade === 'ANUAL' && !mesVencimentoRaw) {
    return { error: 'Obrigação anual precisa de um mês de vencimento.' };
  }

  try {
    await apiFetch('/tipos-obrigacao-fiscal', {
      method: 'POST',
      body: JSON.stringify({
        nome,
        periodicidade,
        diaVencimento: Number(diaVencimentoRaw),
        mesVencimento: mesVencimentoRaw ? Number(mesVencimentoRaw) : undefined,
        regimesAplicaveis,
      }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const body = error.body as { message?: string | string[] } | undefined;
      const message = Array.isArray(body?.message) ? body.message.join('; ') : body?.message;
      return { error: message ?? 'Não foi possível criar a obrigação fiscal.' };
    }
    return { error: 'Não foi possível criar a obrigação fiscal.' };
  }

  revalidatePath('/obrigacoes-fiscais');
  return {};
}

export async function desativarTipoObrigacaoFiscalAction(id: string) {
  await apiFetch(`/tipos-obrigacao-fiscal/${id}`, { method: 'DELETE' });
  revalidatePath('/obrigacoes-fiscais');
}
