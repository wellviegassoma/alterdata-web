import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';
import type { EmpresaResumo } from '@/lib/types';

interface EmpresaBackend {
  id: string;
  attributes?: {
    nome?: string;
    cpfCnpjAlfanumerico?: string;
    ativa?: boolean;
  };
}

/**
 * Proxy server-side de busca de empresas do eContador: o token da sessão
 * nunca vai pro navegador, então essa busca precisa passar pelo nosso
 * próprio backend Next.js antes de chegar na alterdata-api.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  let data: { data: EmpresaBackend[] };
  try {
    data = await apiFetch<{ data: EmpresaBackend[] }>('/empresas?limit=100');
  } catch {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const resultados: EmpresaResumo[] = data.data
    .map((item) => ({
      id: item.id,
      nome: item.attributes?.nome ?? '',
      cpfCnpjAlfanumerico: item.attributes?.cpfCnpjAlfanumerico ?? '',
      ativa: item.attributes?.ativa ?? false,
    }))
    .filter(
      (empresa) =>
        empresa.nome.toLowerCase().includes(q) || empresa.cpfCnpjAlfanumerico.includes(q),
    )
    .slice(0, 15);

  return NextResponse.json(resultados);
}
