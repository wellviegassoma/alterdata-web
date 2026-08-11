import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { Cliente, StatusCliente } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';

const STATUS_LABEL: Record<StatusCliente, string> = {
  ATIVO: 'Ativo',
  EM_ONBOARDING: 'Em onboarding',
  EM_OFFBOARDING: 'Em offboarding',
  INATIVO: 'Inativo',
};

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [user, clientes] = await Promise.all([
    requireUser(),
    apiFetch<Cliente[]>(`/clientes${status ? `?status=${status}` : ''}`),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Clientes</h1>
          <Link
            href="/clientes/novo"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Novo cliente
          </Link>
        </div>

        <div className="flex gap-2 text-sm">
          {(['', 'ATIVO', 'EM_ONBOARDING', 'EM_OFFBOARDING', 'INATIVO'] as const).map((s) => (
            <Link
              key={s || 'todos'}
              href={s ? `/clientes?status=${s}` : '/clientes'}
              className={`rounded-full px-3 py-1 ${
                (status ?? '') === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s ? STATUS_LABEL[s] : 'Todos'}
            </Link>
          ))}
        </div>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          {clientes.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Nenhum cliente encontrado.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-6 py-3 font-medium">CNPJ/CPF</th>
                  <th className="px-6 py-3 font-medium">Contato principal</th>
                  <th className="px-6 py-3 font-medium">Responsável</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => {
                  const principal = cliente.contatos.find((c) => c.principal) ?? cliente.contatos[0];
                  return (
                    <tr key={cliente.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-3">
                        <Link
                          href={`/clientes/${cliente.cnpjCpf}`}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {cliente.cnpjCpf}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-slate-600">{principal?.nome ?? '—'}</td>
                      <td className="px-6 py-3 text-slate-600">
                        {cliente.responsavelInterno?.nome ?? '—'}
                      </td>
                      <td className="px-6 py-3 text-slate-600">{STATUS_LABEL[cliente.status]}</td>
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
