import Link from 'next/link';
import { LogoutButton } from './LogoutButton';
import type { AuthenticatedUser } from '@/lib/types';

export function AppHeader({ user }: { user: AuthenticatedUser }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-slate-900">
            SOMA Contabilidade
          </Link>
          <Link href="/clientes" className="text-sm text-slate-600 hover:text-slate-900">
            Clientes
          </Link>
          <Link href="/documentos" className="text-sm text-slate-600 hover:text-slate-900">
            Documentos
          </Link>
          <Link href="/tipos-documento" className="text-sm text-slate-600 hover:text-slate-900">
            Tipos de documento
          </Link>
          <Link href="/obrigacoes" className="text-sm text-slate-600 hover:text-slate-900">
            Obrigações
          </Link>
          <Link href="/obrigacoes-fiscais" className="text-sm text-slate-600 hover:text-slate-900">
            Tipos de obrigação
          </Link>
          <Link href="/analises" className="text-sm text-slate-600 hover:text-slate-900">
            Análises
          </Link>
          {user.papel === 'ADMIN' && (
            <>
              <Link href="/usuarios" className="text-sm text-slate-600 hover:text-slate-900">
                Usuários
              </Link>
              <Link href="/backup" className="text-sm text-slate-600 hover:text-slate-900">
                Backup
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-500">
            {user.email} · <span className="uppercase">{user.papel}</span>
          </p>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
