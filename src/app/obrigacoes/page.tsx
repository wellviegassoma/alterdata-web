import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { ObrigacaoCliente, StatusObrigacao } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton';
import { GerarObrigacoesForm } from './GerarObrigacoesForm';
import { MarcarCumpridaButton } from './MarcarCumpridaButton';
import { deleteObrigacaoClienteAction } from './actions';

const STATUS_ESTILO: Record<StatusObrigacao, string> = {
  VENCIDO: 'bg-red-100 text-red-700',
  VENCENDO: 'bg-amber-100 text-amber-700',
  OK: 'bg-slate-100 text-slate-600',
  CUMPRIDA: 'bg-emerald-100 text-emerald-700',
};

const STATUS_LABEL: Record<StatusObrigacao, string> = {
  VENCIDO: 'Vencido',
  VENCENDO: 'Vencendo',
  OK: 'Pendente',
  CUMPRIDA: 'Cumprida',
};

const FILTROS = ['TODOS', 'VENCIDO', 'VENCENDO', 'OK', 'CUMPRIDA'] as const;
type Filtro = (typeof FILTROS)[number];

function competenciaAtual(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

export default async function ObrigacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; competencia?: string; criadas?: string; jaExistiam?: string }>;
}) {
  const { status, competencia, criadas, jaExistiam } = await searchParams;
  const filtro: Filtro = FILTROS.includes(status as Filtro) ? (status as Filtro) : 'TODOS';
  const competenciaFiltro = competencia || competenciaAtual();

  const user = await requireUser();
  const obrigacoes = await apiFetch<ObrigacaoCliente[]>('/obrigacoes-cliente');

  const daCompetencia = obrigacoes.filter(
    (o) => o.competencia === competenciaFiltro || o.competencia === competenciaFiltro.slice(0, 4),
  );
  const filtradas =
    filtro === 'TODOS' ? daCompetencia : daCompetencia.filter((o) => o.status === filtro);

  const contagem = {
    VENCIDO: daCompetencia.filter((o) => o.status === 'VENCIDO').length,
    VENCENDO: daCompetencia.filter((o) => o.status === 'VENCENDO').length,
    OK: daCompetencia.filter((o) => o.status === 'OK').length,
    CUMPRIDA: daCompetencia.filter((o) => o.status === 'CUMPRIDA').length,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Obrigações fiscais</h1>
            <p className="text-sm text-slate-500">
              Instâncias geradas a partir dos tipos cadastrados em{' '}
              <Link href="/obrigacoes-fiscais" className="font-medium text-slate-900 hover:underline">
                Obrigações fiscais (catálogo)
              </Link>
              .
            </p>
          </div>
          <a
            href={`/api/export/obrigacoes?status=${filtro}&competencia=${competenciaFiltro}`}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Exportar Excel
          </a>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <GerarObrigacoesForm defaultCompetencia={competenciaFiltro} />
        </section>

        {criadas !== undefined && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Geração concluída: <strong>{criadas}</strong> obrigação(ões) nova(s),{' '}
            <strong>{jaExistiam}</strong> já existiam.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <form className="flex items-center gap-2 text-sm">
            <label htmlFor="competenciaFiltro" className="text-slate-600">
              Competência exibida:
            </label>
            <input
              id="competenciaFiltro"
              name="competencia"
              type="month"
              defaultValue={competenciaFiltro}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
            >
              Ver
            </button>
          </form>
        </div>

        <div className="flex gap-2 text-sm">
          {FILTROS.map((f) => (
            <Link
              key={f}
              href={`/obrigacoes?competencia=${competenciaFiltro}${f === 'TODOS' ? '' : `&status=${f}`}`}
              className={`rounded-full px-3 py-1 ${
                filtro === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {STATUS_LABEL[f as StatusObrigacao] ?? 'Todos'}
              {f !== 'TODOS' && ` (${contagem[f as Exclude<Filtro, 'TODOS'>]})`}
            </Link>
          ))}
        </div>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          {filtradas.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              Nenhuma obrigação encontrada pra essa competência/filtro. Use o botão acima pra gerar
              as obrigações do mês.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Obrigação</th>
                  <th className="px-6 py-3 font-medium">Competência</th>
                  <th className="px-6 py-3 font-medium">Vencimento</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((obrigacao) => {
                  const remover = deleteObrigacaoClienteAction.bind(null, obrigacao.id);
                  return (
                    <tr key={obrigacao.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-3">
                        <Link
                          href={`/clientes/${obrigacao.cliente.cnpjCpf}`}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {obrigacao.cliente.nome ||
                            obrigacao.cliente.nomeFantasia ||
                            obrigacao.cliente.cnpjCpf}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-slate-600">{obrigacao.tipoObrigacao.nome}</td>
                      <td className="px-6 py-3 text-slate-600">{obrigacao.competencia}</td>
                      <td className="px-6 py-3 text-slate-600">
                        {obrigacao.dataVencimento.slice(0, 10)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_ESTILO[obrigacao.status]}`}
                        >
                          {STATUS_LABEL[obrigacao.status]}
                          {(obrigacao.status === 'VENCIDO' || obrigacao.status === 'VENCENDO') &&
                            ` · ${Math.abs(obrigacao.diasRestantes)}d`}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <MarcarCumpridaButton id={obrigacao.id} cumprida={obrigacao.cumprida} />
                          <form action={remover}>
                            <ConfirmSubmitButton
                              confirmMessage="Remover esta obrigação?"
                              className="text-xs font-medium text-red-600 hover:underline"
                            >
                              Remover
                            </ConfirmSubmitButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
