import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { Cliente } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';

export default async function DashboardPage() {
  const user = await requireUser();
  const clientes = await apiFetch<Cliente[]>('/clientes?take=5');

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-lg font-semibold text-slate-900">Início</h1>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Clientes recentes</h2>
            <Link href="/clientes" className="text-sm font-medium text-slate-900 hover:underline">
              Ver todos →
            </Link>
          </div>

          {clientes.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum cliente cadastrado ainda.{' '}
              <Link href="/clientes/novo" className="font-medium text-slate-900 hover:underline">
                Cadastrar o primeiro
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {clientes.map((cliente) => (
                <li key={cliente.id} className="flex items-center justify-between py-2">
                  <Link href={`/clientes/${cliente.cnpjCpf}`} className="hover:underline">
                    {cliente.nomeFantasia || cliente.nome || cliente.cnpjCpf}
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
