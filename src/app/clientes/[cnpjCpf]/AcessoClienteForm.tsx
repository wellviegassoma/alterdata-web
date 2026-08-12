'use client';

import { useActionState } from 'react';
import { createAcessoClienteAction, AcessoClienteFormState } from './acessos-actions';

const initialState: AcessoClienteFormState = {};

export function AcessoClienteForm({ clienteId, cnpjCpf }: { clienteId: string; cnpjCpf: string }) {
  const action = createAcessoClienteAction.bind(null, clienteId, cnpjCpf);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid grid-cols-4 gap-3 rounded-md border border-slate-200 p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="portal" className="text-xs font-medium text-slate-700">
          Portal <span className="text-red-500">*</span>
        </label>
        <input
          id="portal"
          name="portal"
          type="text"
          required
          placeholder="ex.: gov.br"
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="login" className="text-xs font-medium text-slate-700">
          Login
        </label>
        <input
          id="login"
          name="login"
          type="text"
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="senha" className="text-xs font-medium text-slate-700">
          Senha <span className="text-red-500">*</span>
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoComplete="new-password"
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="observacoes" className="text-xs font-medium text-slate-700">
          Observações
        </label>
        <input
          id="observacoes"
          name="observacoes"
          type="text"
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      {state.error && <p className="col-span-4 text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="col-span-4 self-start rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? 'Salvando...' : 'Adicionar acesso'}
      </button>
    </form>
  );
}
