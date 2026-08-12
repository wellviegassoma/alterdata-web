import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';
import type { EmpresaEcontador } from '@/lib/types';

/**
 * Proxy server-side para GET /empresas/:id/completa — usado ao selecionar
 * uma empresa na busca, para trazer nomeFantasia/código/endereço de uma vez.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const detalhe = await apiFetch<EmpresaEcontador>(`/empresas/${id}/completa`);
    return NextResponse.json(detalhe);
  } catch {
    return NextResponse.json({ error: 'Não foi possível carregar a empresa' }, { status: 502 });
  }
}
