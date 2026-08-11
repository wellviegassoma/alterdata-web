import { redirect } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import type { AuthenticatedUser, Cliente } from '@/lib/types';
import { LogoutButton } from '@/components/LogoutButton';

const STATUS_LABEL: Record<Cliente['status'], string> = {
  ATIVO: 'Ativo',
  EM_ONBOARDING: 'Em onboarding',
  EM_OFFBOARDING: 'Em offboarding',
  INATIVO: 'Inativo',
};

export default async function DashboardPage() {
  let user: AuthenticatedUser;
  let clientes: Cliente[];
  try {
    [user, clientes] = await Promise.all([
      apiFetch<AuthenticatedUser>('/auth/me'),
      apiFetch<Cliente[]>('/clientes'),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Cookie presente mas token expirado/inválido: o proxy só checa presença do cookie.
      redirect('/login');
    }
    throw error;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Escritório Contábil</h1>
          <p className="text-sm text-slate-500">
            {user.email} · <span className="uppercase">{user.papel}</span>
          </p>
        </div>
        <LogoutButton />
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Clientes</h2>
          <span className="text-xs text-slate-400">{clientes.length} cadastrado(s)</span>
        </div>

        {clientes.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum cliente cadastrado ainda.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 font-medium">CNPJ/CPF</th>
                <th className="py-2 font-medium">Contato principal</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => {
                const principal = cliente.contatos.find((c) => c.principal) ?? cliente.contatos[0];
                return (
                  <tr key={cliente.id} className="border-b border-slate-100">
                    <td className="py-2 text-slate-900">{cliente.cnpjCpf}</td>
                    <td className="py-2 text-slate-600">{principal?.nome ?? '—'}</td>
                    <td className="py-2 text-slate-600">{STATUS_LABEL[cliente.status]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
