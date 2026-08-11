import { logoutAction } from '@/lib/auth-actions';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        Sair
      </button>
    </form>
  );
}
