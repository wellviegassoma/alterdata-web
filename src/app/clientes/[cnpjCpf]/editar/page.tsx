import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { Cliente, Usuario } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { ClienteForm } from '../../ClienteForm';
import { updateClienteAction } from '../../actions';

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ cnpjCpf: string }>;
}) {
  const { cnpjCpf } = await params;
  const user = await requireUser();
  const [cliente, usuarios] = await Promise.all([
    apiFetch<Cliente>(`/clientes/${cnpjCpf}`),
    apiFetch<Usuario[]>('/usuarios-internos'),
  ]);

  const actionComCnpj = updateClienteAction.bind(null, cnpjCpf);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-lg font-semibold text-slate-900">Editar cliente</h1>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <ClienteForm action={actionComCnpj} usuarios={usuarios} cliente={cliente} />
        </div>
      </main>
    </div>
  );
}
