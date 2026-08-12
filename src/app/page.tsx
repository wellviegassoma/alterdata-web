import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { Cliente, DocumentoCliente } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';

export default async function DashboardPage() {
  const user = await requireUser();
  const [clientes, alertas] = await Promise.all([
    apiFetch<Cliente[]>('/clientes?take=5'),
    apiFetch<DocumentoCliente[]>('/documentos-cliente/alertas'),
  ]);

  const vencidos = alertas.filter((a) => a.status === 'VENCIDO');
  const vencendo = alertas.filter((a) => a.status === 'VENCENDO');

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-lg font-semibold text-slate-900">Início</h1>

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
                      {doc.cliente.nomeFantasia || doc.cliente.nome || doc.cliente.cnpjCpf}
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
