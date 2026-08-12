'use client';

import { useActionState } from 'react';
import { gerarObrigacoesAction, GerarObrigacoesFormState } from './actions';

const initialState: GerarObrigacoesFormState = {};

export function GerarObrigacoesForm({ defaultCompetencia }: { defaultCompetencia: string }) {
  const [state, formAction, pending] = useActionState(gerarObrigacoesAction, initialState);

  return (
    <form action={formAction} className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <label htmlFor="competencia" className="text-xs font-medium text-slate-700">
          Competência
        </label>
        <input
          id="competencia"
          name="competencia"
          type="month"
          required
          defaultValue={defaultCompetencia}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? 'Gerando...' : 'Gerar obrigações desta competência'}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
