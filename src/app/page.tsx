import Link from 'next/link';
import { apiFetch, ApiError } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type {
  Cliente,
  ClienteCompleto,
  DocumentoCliente,
  ObrigacaoCliente,
  StatusObrigacao,
  StatusVencimento,
} from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { ClienteQuickSearch } from '@/components/ClienteQuickSearch';

const STATUS_DOC_ESTILO: Record<StatusVencimento, string> = {
  VENCIDO: 'bg-red-100 text-red-700',
  VENCENDO: 'bg-amber-100 text-amber-700',
  OK: 'bg-emerald-100 text-emerald-700',
};
const STATUS_DOC_LABEL: Record<StatusVencimento, string> = {
  VENCIDO: 'Vencido',
  VENCENDO: 'Vencendo',
  OK: 'Em dia',
};
const STATUS_OBR_ESTILO: Record<StatusObrigacao, string> = {
  VENCIDO: 'bg-red-100 text-red-700',
  VENCENDO: 'bg-amber-100 text-amber-700',
  OK: 'bg-slate-100 text-slate-600',
  CUMPRIDA: 'bg-emerald-100 text-emerald-700',
};
const STATUS_OBR_LABEL: Record<StatusObrigacao, string> = {
  VENCIDO: 'Vencido',
  VENCENDO: 'Vencendo',
  OK: 'Pendente',
  CUMPRIDA: 'Cumprida',
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ cliente?: string }>;
}) {
  const { cliente: cnpjCpfSelecionado } = await searchParams;
  const user = await requireUser();
  const [clientesRecentes, todosClientes, alertas, alertasObrigacoes] = await Promise.all([
    apiFetch<Cliente[]>('/clientes?take=5'),
    apiFetch<Cliente[]>('/clientes?take=2000'),
    apiFetch<DocumentoCliente[]>('/documentos-cliente/alertas'),
    apiFetch<ObrigacaoCliente[]>('/obrigacoes-cliente/alertas'),
  ]);

  const vencidos = alertas.filter((a) => a.status === 'VENCIDO');
  const vencendo = alertas.filter((a) => a.status === 'VENCENDO');
  const obrigacoesVencidas = alertasObrigacoes.filter((o) => o.status === 'VENCIDO');
  const obrigacoesVencendo = alertasObrigacoes.filter((o) => o.status === 'VENCENDO');

  let clienteSelecionado: ClienteCompleto | null = null;
  let documentosSelecionado: DocumentoCliente[] = [];
  let obrigacoesSelecionado: ObrigacaoCliente[] = [];
  if (cnpjCpfSelecionado) {
    try {
      clienteSelecionado = await apiFetch<ClienteCompleto>(
        `/clientes/${cnpjCpfSelecionado}/completo`,
      );
      [documentosSelecionado, obrigacoesSelecionado] = await Promise.all([
        apiFetch<DocumentoCliente[]>(`/documentos-cliente?clienteId=${clienteSelecionado.local.id}`),
        apiFetch<ObrigacaoCliente[]>(`/obrigacoes-cliente?clienteId=${clienteSelecionado.local.id}`),
      ]);
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 404)) throw error;
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-lg font-semibold text-slate-900">Início</h1>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Consultar empresa</h2>
          <ClienteQuickSearch
            clientes={todosClientes.map((c) => ({
              id: c.id,
              codigo: c.codigo,
              nome: c.nome,
              nomeFantasia: c.nomeFantasia,
              cnpjCpf: c.cnpjCpf,
            }))}
          />

          {cnpjCpfSelecionado && !clienteSelecionado && (
            <p className="mt-4 text-sm text-slate-500">Cliente não encontrado.</p>
          )}

          {clienteSelecionado && (
            <div className="mt-4 flex flex-col gap-4 rounded-md border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {clienteSelecionado.econtador?.nome ||
                      clienteSelecionado.local.nome ||
                      clienteSelecionado.local.cnpjCpf}
                  </p>
                  <p className="text-xs text-slate-500">
                    Código {clienteSelecionado.local.codigo ?? '—'} ·{' '}
                    {clienteSelecionado.local.cnpjCpf} · {clienteSelecionado.local.status}
                  </p>
                </div>
                <Link
                  href={`/clientes/${clienteSelecionado.local.cnpjCpf}`}
                  className="text-sm font-medium text-slate-900 hover:underline"
                >
                  Ver cadastro completo →
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-slate-500">
                <p>Fiscal: {clienteSelecionado.local.responsavelFiscal?.nome ?? '—'}</p>
                <p>Contábil: {clienteSelecionado.local.responsavelContabil?.nome ?? '—'}</p>
                <p>DP: {clienteSelecionado.local.responsavelDp?.nome ?? '—'}</p>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold text-slate-700">Documentos pendentes</p>
                {documentosSelecionado.filter((d) => d.status !== 'OK').length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhum documento pendente.</p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {documentosSelecionado
                      .filter((d) => d.status !== 'OK')
                      .map((d) => (
                        <li key={d.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{d.tipoDocumento.nome}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_DOC_ESTILO[d.status]}`}
                          >
                            {STATUS_DOC_LABEL[d.status]} · {Math.abs(d.diasRestantes)}d
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold text-slate-700">Obrigações pendentes</p>
                {obrigacoesSelecionado.filter((o) => o.status !== 'OK' && o.status !== 'CUMPRIDA')
                  .length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhuma obrigação pendente.</p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {obrigacoesSelecionado
                      .filter((o) => o.status !== 'OK' && o.status !== 'CUMPRIDA')
                      .map((o) => (
                        <li key={o.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">
                            {o.tipoObrigacao.nome} ({o.competencia})
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_OBR_ESTILO[o.status]}`}
                          >
                            {STATUS_OBR_LABEL[o.status]} · {Math.abs(o.diasRestantes)}d
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        {(vencidos.length > 0 || vencendo.length > 0) && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-amber-900">
              Documentos que precisam de atenção
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {[...vencidos, ...vencendo].map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <Link href={`/clientes/${doc.cliente.cnpjCpf}`} className="hover:underline">
                    <span className="font-medium text-slate-900">
                      {doc.cliente.nome || doc.cliente.nomeFantasia || doc.cliente.cnpjCpf}
                    </span>
                    <span className="text-slate-600"> — {doc.tipoDocumento.nome}</span>
                  </Link>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      doc.status === 'VENCIDO'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {doc.status === 'VENCIDO'
                      ? `Vencido há ${Math.abs(doc.diasRestantes)}d`
                      : `Vence em ${doc.diasRestantes}d`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(obrigacoesVencidas.length > 0 || obrigacoesVencendo.length > 0) && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-amber-900">
              Obrigações fiscais pendentes
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {[...obrigacoesVencidas, ...obrigacoesVencendo].map((obrigacao) => (
                <li key={obrigacao.id} className="flex items-center justify-between">
                  <Link href={`/clientes/${obrigacao.cliente.cnpjCpf}`} className="hover:underline">
                    <span className="font-medium text-slate-900">
                      {obrigacao.cliente.nome ||
                        obrigacao.cliente.nomeFantasia ||
                        obrigacao.cliente.cnpjCpf}
                    </span>
                    <span className="text-slate-600">
                      {' '}
                      — {obrigacao.tipoObrigacao.nome} ({obrigacao.competencia})
                    </span>
                  </Link>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      obrigacao.status === 'VENCIDO'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {obrigacao.status === 'VENCIDO'
                      ? `Vencido há ${Math.abs(obrigacao.diasRestantes)}d`
                      : `Vence em ${obrigacao.diasRestantes}d`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Clientes recentes</h2>
            <Link href="/clientes" className="text-sm font-medium text-slate-900 hover:underline">
              Ver todos →
            </Link>
          </div>

          {clientesRecentes.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum cliente cadastrado ainda.{' '}
              <Link href="/clientes/novo" className="font-medium text-slate-900 hover:underline">
                Cadastrar o primeiro
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {clientesRecentes.map((cliente) => (
                <li key={cliente.id} className="flex items-center justify-between py-2">
                  <Link href={`/clientes/${cliente.cnpjCpf}`} className="hover:underline">
                    {cliente.nome || cliente.nomeFantasia || cliente.cnpjCpf}
                  </Link>
                  <span className="text-slate-500">{cliente.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
