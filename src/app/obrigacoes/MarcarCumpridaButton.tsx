'use client';

import { useTransition } from 'react';
import { marcarCumpridaAction } from './actions';

export function MarcarCumpridaButton({ id, cumprida }: { id: string; cumprida: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => marcarCumpridaAction(id, !cumprida))}
      className="text-xs font-medium text-slate-600 hover:underline disabled:opacity-50"
    >
      {pending ? '...' : cumprida ? 'Reabrir' : 'Marcar cumprida'}
    </button>
  );
}
