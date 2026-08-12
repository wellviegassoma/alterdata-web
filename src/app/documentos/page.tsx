import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { DocumentoCliente, StatusVencimento } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';

const STATUS_ESTILO: Record<StatusVencimento, string> = {
  VENCIDO: 'bg-red-100 text-red-700',
  VENCENDO: 'bg-amber-100 text-amber-700',
  OK: 'bg-emerald-100 text-emerald-700',
};

const STATUS_LABEL: Record<StatusVencimento, string> = {
  VENCIDO: 'Vencido',
  VENCENDO: 'Vencendo',
  OK: 'Em dia',
};

const FILTROS = ['TODOS', 'VENCIDO', 'VENCENDO', 'OK'] as const;
type Filtro = (typeof FILTROS)[number];

const FILTRO_LABEL: Record<Filtro, string> = {
  TODOS: 'Todos',
  VENCIDO: 'Vencidos',
  VENCENDO: 'Vencendo',
  OK: 'Em dia',
};

export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filtro: Filtro = FILTROS.includes(status as Filtro) ? (status as Filtro) : 'TODOS';

  const user = await requireUser();
  const documentos = await apiFetch<DocumentoCliente[]>('/documentos-cliente');

  const filtrados =
    filtro === 'TODOS' ? documentos : documentos.filter((d) => d.status === filtro);

  const contagem = {
    VENCIDO: documentos.filter((d) => d.status === 'VENCIDO').length,
    VENCENDO: documentos.filter((d) => d.status === 'VENCENDO').length,
    OK: documentos.filter((d) => d.status === 'OK').length,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Painel de documentos</h1>
            <p className="text-sm text-slate-500">
              Todos os documentos controlados de todos os clientes, num só lugar.
            </p>
          </div>
          <a
            href={`/api/export/documentos?status=${filtro}`}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Exportar Excel
          </a>
        </div>

        <div className="flex gap-2 text-sm">
          {FILTROS.map((f) => (
            <Link
              key={f}
              href={f === 'TODOS' ? '/documentos' : `/documentos?status=${f}`}
              className={`rounded-full px-3 py-1 ${
                filtro === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {FILTRO_LABEL[f]}
              {f !== 'TODOS' && ` (${contagem[f]})`}
            </Link>
          ))}
        </div>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          {filtrados.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Nenhum documento encontrado.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Vencimento</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Observações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-3">
                      <Link
                        href={`/clientes/${doc.cliente.cnpjCpf}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {doc.cliente.nome || doc.cliente.nomeFantasia || doc.cliente.cnpjCpf}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{doc.tipoDocumento.nome}</td>
                    <td className="px-6 py-3 text-slate-600">{doc.dataVencimento.slice(0, 10)}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_ESTILO[doc.status]}`}
                      >
                        {STATUS_LABEL[doc.status]}
                        {doc.status !== 'OK' && ` · ${Math.abs(doc.diasRestantes)}d`}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{doc.observacoes ?? '—'}</td>
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
