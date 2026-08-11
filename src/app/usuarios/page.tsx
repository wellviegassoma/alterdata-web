import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { requireAdmin } from '@/lib/require-user';
import type { Usuario } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton';
import { updateUsuarioPapelAction, deleteUsuarioAction } from './actions';

export default async function UsuariosPage() {
  const user = await requireAdmin();
  const usuarios = await apiFetch<Usuario[]>('/usuarios-internos');

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Usuários do escritório</h1>
          <Link
            href="/usuarios/novo"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Novo usuário
          </Link>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">E-mail</th>
                <th className="px-6 py-3 font-medium">Papel</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const atualizarPapel = updateUsuarioPapelAction.bind(null, u.id);
                const remover = deleteUsuarioAction.bind(null, u.id);
                const isVoce = u.id === user.id;
                return (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-3 text-slate-900">
                      {u.nome} {isVoce && <span className="text-xs text-slate-400">(você)</span>}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{u.email}</td>
                    <td className="px-6 py-3">
                      <form action={atualizarPapel} className="flex items-center gap-2">
                        <select
                          name="papel"
                          defaultValue={u.papel}
                          disabled={isVoce}
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-50"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="CONTADOR">CONTADOR</option>
                          <option value="ANALISTA">ANALISTA</option>
                        </select>
                        {!isVoce && (
                          <button
                            type="submit"
                            className="text-xs font-medium text-slate-600 hover:underline"
                          >
                            Salvar
                          </button>
                        )}
                      </form>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {!isVoce && (
                        <form action={remover}>
                          <ConfirmSubmitButton
                            confirmMessage={`Remover o acesso de ${u.nome}?`}
                            className="text-xs font-medium text-red-600 hover:underline"
                          >
                            Remover
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
