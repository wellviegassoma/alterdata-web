'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export interface TipoDocumentoFormState {
  error?: string;
}

export async function createTipoDocumentoAction(
  _prevState: TipoDocumentoFormState,
  formData: FormData,
): Promise<TipoDocumentoFormState> {
  const nome = String(formData.get('nome') ?? '').trim();
  if (!nome) {
    return { error: 'Informe o nome do tipo de documento.' };
  }
  const periodicidadeRaw = String(formData.get('periodicidadeMeses') ?? '').trim();

  try {
    await apiFetch('/tipos-documento', {
      method: 'POST',
      body: JSON.stringify({
        nome,
        periodicidadeMeses: periodicidadeRaw ? Number(periodicidadeRaw) : undefined,
      }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const body = error.body as { message?: string | string[] } | undefined;
      const message = Array.isArray(body?.message) ? body.message.join('; ') : body?.message;
      return { error: message ?? 'Não foi possível criar o tipo de documento.' };
    }
    return { error: 'Não foi possível criar o tipo de documento.' };
  }

  revalidatePath('/tipos-documento');
  return {};
}

export async function desativarTipoDocumentoAction(id: string) {
  await apiFetch(`/tipos-documento/${id}`, { method: 'DELETE' });
  revalidatePath('/tipos-documento');
}
