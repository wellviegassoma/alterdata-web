import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { TipoDocumento } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton';
import { TipoDocumentoForm } from './TipoDocumentoForm';
import { desativarTipoDocumentoAction } from './actions';

export default async function TiposDocumentoPage() {
  const user = await requireUser();
  const tipos = await apiFetch<TipoDocumento[]>('/tipos-documento?incluirInativos=true');

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Tipos de documento</h1>
          <p className="text-sm text-slate-500">
            Cadastre aqui os tipos de documento que o escritório controla por vencimento (ex.:
            Alvará de Funcionamento, Vigilância Sanitária, Conselho de Classe). Depois é só
            associar um vencimento a cada cliente na página dele.
          </p>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <TipoDocumentoForm />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Periodicidade</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => {
                const desativar = desativarTipoDocumentoAction.bind(null, tipo.id);
                return (
                  <tr key={tipo.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-3 text-slate-900">{tipo.nome}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {tipo.periodicidadeMeses ? `${tipo.periodicidadeMeses} meses` : '—'}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{tipo.ativo ? 'Ativo' : 'Inativo'}</td>
                    <td className="px-6 py-3 text-right">
                      {tipo.ativo && (
                        <form action={desativar}>
                          <ConfirmSubmitButton
                            confirmMessage={`Desativar "${tipo.nome}"? Documentos já lançados com esse tipo continuam existindo, só não vai poder criar novos.`}
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
