'use client';

import { useActionState } from 'react';
import { createTipoDocumentoAction, TipoDocumentoFormState } from './actions';

const initialState: TipoDocumentoFormState = {};

export function TipoDocumentoForm() {
  const [state, formAction, pending] = useActionState(createTipoDocumentoAction, initialState);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor="nome" className="text-sm font-medium text-slate-700">
          Nome do tipo de documento
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          placeholder="ex.: Licença Ambiental"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div className="flex w-40 flex-col gap-1">
        <label htmlFor="periodicidadeMeses" className="text-sm font-medium text-slate-700">
          Periodicidade (meses)
        </label>
        <input
          id="periodicidadeMeses"
          name="periodicidadeMeses"
          type="number"
          min={1}
          placeholder="ex.: 12"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? 'Adicionando...' : 'Adicionar'}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
