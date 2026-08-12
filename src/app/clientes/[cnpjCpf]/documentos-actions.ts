'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export interface DocumentoClienteFormState {
  error?: string;
}

export async function createDocumentoClienteAction(
  clienteId: string,
  cnpjCpf: string,
  _prevState: DocumentoClienteFormState,
  formData: FormData,
): Promise<DocumentoClienteFormState> {
  const tipoDocumentoId = String(formData.get('tipoDocumentoId') ?? '').trim();
  const dataVencimento = String(formData.get('dataVencimento') ?? '').trim();
  const dataEmissao = String(formData.get('dataEmissao') ?? '').trim();
  const observacoes = String(formData.get('observacoes') ?? '').trim();

  if (!tipoDocumentoId || !dataVencimento) {
    return { error: 'Escolha o tipo de documento e a data de vencimento.' };
  }

  try {
    await apiFetch('/documentos-cliente', {
      method: 'POST',
      body: JSON.stringify({
        clienteId,
        tipoDocumentoId,
        dataVencimento,
        dataEmissao: dataEmissao || undefined,
        observacoes: observacoes || undefined,
      }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const body = error.body as { message?: string | string[] } | undefined;
      const message = Array.isArray(body?.message) ? body.message.join('; ') : body?.message;
      return { error: message ?? 'Não foi possível adicionar o documento.' };
    }
    return { error: 'Não foi possível adicionar o documento.' };
  }

  revalidatePath(`/clientes/${cnpjCpf}`);
  return {};
}

export async function deleteDocumentoClienteAction(id: string, cnpjCpf: string) {
  await apiFetch(`/documentos-cliente/${id}`, { method: 'DELETE' });
  revalidatePath(`/clientes/${cnpjCpf}`);
}
