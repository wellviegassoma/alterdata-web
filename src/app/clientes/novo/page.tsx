import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { Usuario } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { ClienteForm } from '../ClienteForm';
import { createClienteAction } from '../actions';

export default async function NovoClientePage() {
  const [user, usuarios] = await Promise.all([requireUser(), apiFetch<Usuario[]>('/usuarios-internos')]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-lg font-semibold text-slate-900">Novo cliente</h1>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <ClienteForm action={createClienteAction} usuarios={usuarios} />
        </div>
      </main>
    </div>
  );
}
