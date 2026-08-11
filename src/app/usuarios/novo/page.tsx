import { requireAdmin } from '@/lib/require-user';
import { AppHeader } from '@/components/AppHeader';
import { UsuarioForm } from './UsuarioForm';

export default async function NovoUsuarioPage() {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-lg font-semibold text-slate-900">Novo usuário</h1>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <UsuarioForm />
        </div>
      </main>
    </div>
  );
}
