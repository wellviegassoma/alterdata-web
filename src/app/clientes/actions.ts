'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export interface ClienteFormState {
  error?: string;
}

function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== '') (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

function buildPayload(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;
  };
  const getNum = (k: string) => {
    const v = get(k);
    return v !== undefined ? Number(v) : undefined;
  };

  const endereco = compact({
    cep: get('cep'),
    rua: get('rua'),
    numero: get('numero'),
    complemento: get('complemento'),
    bairro: get('bairro'),
    cidade: get('cidade'),
    uf: get('uf'),
  });

  const dadosFiscais = compact({
    regimeTributario: get('regimeTributario'),
    cnaePrincipal: get('cnaePrincipal'),
    inscricaoEstadual: get('inscricaoEstadual'),
    inscricaoMunicipal: get('inscricaoMunicipal'),
  });

  const contrato = compact({
    valorHonorarios: getNum('valorHonorarios'),
    diaVencimento: getNum('diaVencimento'),
    formaPagamento: get('formaPagamento'),
    dataInicio: get('dataInicio'),
    status: get('contratoStatus'),
    observacoes: get('contratoObservacoes'),
  });

  let contatos;
  const contatosRaw = get('contatosJson');
  if (contatosRaw) {
    try {
      contatos = JSON.parse(contatosRaw);
    } catch {
      contatos = undefined;
    }
  }

  const tagsRaw = get('tags');
  const tags = tagsRaw
    ? tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : undefined;

  return {
    alterdataEmpresaId: get('alterdataEmpresaId'),
    nome: get('nome'),
    nomeFantasia: get('nomeFantasia'),
    status: get('status'),
    observacoes: get('observacoes'),
    responsavelInternoId: get('responsavelInternoId'),
    endereco: Object.keys(endereco).length ? endereco : undefined,
    dadosFiscais: Object.keys(dadosFiscais).length ? dadosFiscais : undefined,
    contrato: Object.keys(contrato).length ? contrato : undefined,
    contatos,
    tags,
  };
}

export async function createClienteAction(
  _prevState: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  const cnpjCpf = String(formData.get('cnpjCpf') ?? '').trim();
  if (!cnpjCpf) {
    return { error: 'Informe o CNPJ/CPF.' };
  }

  const payload = { cnpjCpf, ...buildPayload(formData) };

  try {
    await apiFetch('/clientes', { method: 'POST', body: JSON.stringify(payload) });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: extrairMensagem(error) };
    }
    return { error: 'Não foi possível criar o cliente.' };
  }

  revalidatePath('/clientes');
  redirect(`/clientes/${cnpjCpf}`);
}

export async function updateClienteAction(
  cnpjCpf: string,
  _prevState: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  const payload = buildPayload(formData);

  try {
    await apiFetch(`/clientes/${cnpjCpf}`, { method: 'PATCH', body: JSON.stringify(payload) });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: extrairMensagem(error) };
    }
    return { error: 'Não foi possível atualizar o cliente.' };
  }

  revalidatePath('/clientes');
  revalidatePath(`/clientes/${cnpjCpf}`);
  redirect(`/clientes/${cnpjCpf}`);
}

export async function deleteClienteAction(cnpjCpf: string) {
  await apiFetch(`/clientes/${cnpjCpf}`, { method: 'DELETE' });
  revalidatePath('/clientes');
  redirect('/clientes');
}

interface ImportarResultado {
  totalAtivasNoEcontador: number;
  importados: number;
  jaExistiam: number;
}

export async function importarAtivosAction() {
  const resultado = await apiFetch<ImportarResultado>('/clientes/importar-ativos', {
    method: 'POST',
  });
  revalidatePath('/clientes');
  redirect(
    `/clientes?importados=${resultado.importados}&jaExistiam=${resultado.jaExistiam}&total=${resultado.totalAtivasNoEcontador}`,
  );
}

function extrairMensagem(error: ApiError): string {
  const body = error.body as { message?: string | string[] } | undefined;
  if (Array.isArray(body?.message)) return body.message.join('; ');
  if (typeof body?.message === 'string') return body.message;
  return 'Erro inesperado ao salvar o cliente.';
}
