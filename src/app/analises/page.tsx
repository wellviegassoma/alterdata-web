import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { DashboardAnalitico, RegimeTributario, StatusCliente } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';

const REGIME_LABEL: Record<RegimeTributario | 'NAO_INFORMADO', string> = {
  MEI: 'MEI',
  SIMPLES_NACIONAL: 'Simples Nacional',
  LUCRO_PRESUMIDO: 'Lucro Presumido',
  LUCRO_REAL: 'Lucro Real',
  ISENTO: 'Isento',
  NAO_INFORMADO: 'Não informado',
};

const STATUS_LABEL: Record<StatusCliente, string> = {
  ATIVO: 'Ativo',
  EM_ONBOARDING: 'Em onboarding',
  EM_OFFBOARDING: 'Em offboarding',
  INATIVO: 'Inativo',
};

function BarraLista({ itens }: { itens: { label: string; total: number }[] }) {
  const max = Math.max(1, ...itens.map((i) => i.total));
  return (
    <div className="flex flex-col gap-2">
      {itens.map((item) => (
        <div key={item.label} className="flex items-center gap-3 text-sm">
          <span className="w-40 shrink-0 text-slate-600">{item.label}</span>
          <div className="h-2 flex-1 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-slate-900"
              style={{ width: `${(item.total / max) * 100}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right font-medium text-slate-900">{item.total}</span>
        </div>
      ))}
    </div>
  );
}

export default async function AnalisesPage() {
  const user = await requireUser();
  const dados = await apiFetch<DashboardAnalitico>('/dashboard/analitico');

  const porRegime = dados.porRegime
    .map((r) => ({ label: REGIME_LABEL[r.regime], total: r.total }))
    .sort((a, b) => b.total - a.total);

  const porStatus = dados.porStatus
    .map((s) => ({ label: STATUS_LABEL[s.status], total: s.total }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-lg font-semibold text-slate-900">Análises</h1>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Clientes por regime tributário
          </h2>
          {porRegime.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum cliente cadastrado ainda.</p>
          ) : (
            <BarraLista itens={porRegime} />
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Clientes por status</h2>
          {porStatus.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum cliente cadastrado ainda.</p>
          ) : (
            <BarraLista itens={porStatus} />
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Carga de trabalho por responsável
          </h2>
          {dados.porResponsavel.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum responsável atribuído ainda.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-medium">Pessoa</th>
                  <th className="py-2 font-medium">Fiscal</th>
                  <th className="py-2 font-medium">Contábil</th>
                  <th className="py-2 font-medium">DP</th>
                  <th className="py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {dados.porResponsavel.map((r) => (
                  <tr key={r.usuarioId} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 text-slate-900">{r.nome}</td>
                    <td className="py-2 text-slate-600">{r.fiscal}</td>
                    <td className="py-2 text-slate-600">{r.contabil}</td>
                    <td className="py-2 text-slate-600">{r.dp}</td>
                    <td className="py-2 font-medium text-slate-900">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
