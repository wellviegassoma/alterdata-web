import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { TipoObrigacaoFiscal } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton';
import { TipoObrigacaoFiscalForm } from './TipoObrigacaoFiscalForm';
import { desativarTipoObrigacaoFiscalAction } from './actions';

const MESES = [
  '', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

export default async function ObrigacoesFiscaisPage() {
  const user = await requireUser();
  const tipos = await apiFetch<TipoObrigacaoFiscal[]>('/tipos-obrigacao-fiscal?incluirInativos=true');

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Obrigações fiscais</h1>
          <p className="text-sm text-slate-500">
            Cadastre aqui as obrigações recorrentes que o escritório controla (ex.: DAS, DCTF,
            DEFIS, ECF). Depois, na tela{' '}
            <span className="font-medium text-slate-700">Obrigações</span>, você gera em lote as
            instâncias do mês/ano pros clientes aplicáveis.
          </p>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <TipoObrigacaoFiscalForm />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Periodicidade</th>
                <th className="px-6 py-3 font-medium">Vencimento</th>
                <th className="px-6 py-3 font-medium">Regimes</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => {
                const desativar = desativarTipoObrigacaoFiscalAction.bind(null, tipo.id);
                return (
                  <tr key={tipo.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-3 text-slate-900">{tipo.nome}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {tipo.periodicidade === 'MENSAL' ? 'Mensal' : 'Anual'}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {tipo.periodicidade === 'ANUAL' && tipo.mesVencimento
                        ? `${tipo.diaVencimento}/${MESES[tipo.mesVencimento]}`
                        : `dia ${tipo.diaVencimento}`}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {tipo.regimesAplicaveis.length ? tipo.regimesAplicaveis.join(', ') : 'Todos'}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{tipo.ativo ? 'Ativo' : 'Inativo'}</td>
                    <td className="px-6 py-3 text-right">
                      {tipo.ativo && (
                        <form action={desativar}>
                          <ConfirmSubmitButton
                            confirmMessage={`Desativar "${tipo.nome}"? Obrigações já geradas com esse tipo continuam existindo, só não vai gerar novas.`}
                            className="text-xs font-medium text-red-600 hover:underline"
                          >
                            Desativar
                          </ConfirmSubmitButton>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
