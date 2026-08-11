'use client';

import { useActionState } from 'react';
import { createUsuarioAction, UsuarioFormState } from '../actions';

const initialState: UsuarioFormState = {};

export function UsuarioForm() {
  const [state, formAction, pending] = useActionState(createUsuarioAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className="text-sm font-medium text-slate-700">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="senha" className="text-sm font-medium text-slate-700">
          Senha inicial
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          minLength={8}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <p className="text-xs text-slate-400">
          Mínimo 8 caracteres. Combine com a pessoa e recomende trocar no primeiro acesso (ainda
          não há tela de troca de senha).
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="papel" className="text-sm font-medium text-slate-700">
          Papel
        </label>
        <select
          id="papel"
          name="papel"
          defaultValue="CONTADOR"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="CONTADOR">CONTADOR</option>
          <option value="ANALISTA">ANALISTA</option>
        </select>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? 'Criando...' : 'Criar usuário'}
      </button>
    </form>
  );
}
