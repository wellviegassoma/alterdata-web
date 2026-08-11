import { LoginForm } from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-slate-900">Escritório Contábil</h1>
        <p className="mb-6 text-sm text-slate-500">Entre com sua conta para continuar.</p>
        <LoginForm redirectTo={redirectTo ?? '/'} />
      </div>
    </main>
  );
}
