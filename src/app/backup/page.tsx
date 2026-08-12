import { requireAdmin } from '@/lib/require-user';
import { AppHeader } from '@/components/AppHeader';

export default async function BackupPage() {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Backup do sistema</h1>
          <p className="mt-1 text-sm text-slate-500">
            Aqui você pode baixar uma cópia de tudo que está cadastrado neste sistema (clientes,
            contatos, endereços, dados fiscais, contratos, tipos de documento, documentos
            controlados e usuários) antes de qualquer atualização, por segurança.
          </p>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Backup manual (.json)</h2>
          <p className="mb-4 text-sm text-slate-600">
            Gera um arquivo com o estado atual de todo o cadastro feito neste sistema. Guarde-o em
            algum lugar seguro (Google Drive, e-mail, etc.). Isso não inclui os dados que vêm
            diretamente do eContador — esses continuam seguros lá, na Alterdata.
          </p>
          <a
            href="/api/backup"
            className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Baixar backup completo
          </a>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <h2 className="mb-2 font-semibold">Sobre o backup automático do banco</h2>
          <p className="mb-2">
            Este botão gera uma cópia pontual, sob demanda — bom para guardar antes de uma
            atualização grande. Mas quem garante a segurança contínua dos dados, dia a dia, é o
            próprio banco de dados (Supabase).
          </p>
          <p>
            Vale a pena entrar no painel do Supabase → seu projeto → <strong>Database → Backups</strong>{' '}
            e conferir se o backup automático diário está ativo (em planos pagos o Supabase guarda
            backups diários e permite restaurar para um ponto no tempo). Se o projeto estiver no
            plano gratuito, considere migrar para um plano pago justamente por causa disso — é a
            proteção mais confiável contra perda de dados.
          </p>
        </section>
      </main>
    </div>
  );
}
