'use client';

import { useActionState, useState } from 'react';
import { createTipoObrigacaoFiscalAction, TipoObrigacaoFiscalFormState } from './actions';
import type { PeriodicidadeObrigacao, RegimeTributario } from '@/lib/types';

const initialState: TipoObrigacaoFiscalFormState = {};

const REGIMES: RegimeTributario[] = [
  'MEI',
  'SIMPLES_NACIONAL',
  'LUCRO_PRESUMIDO',
  'LUCRO_REAL',
  'ISENTO',
];

export function TipoObrigacaoFiscalForm() {
  const [state, formAction, pending] = useActionState(
    createTipoObrigacaoFiscalAction,
    initialState,
  );
  const [periodicidade, setPeriodicidade] = useState<PeriodicidadeObrigacao>('MENSAL');

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="nome" className="text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            placeholder="ex.: DAS"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="periodicidade" className="text-sm font-medium text-slate-700">
            Periodicidade
          </label>
          <select
            id="periodicidade"
            name="periodicidade"
            value={periodicidade}
            onChange={(e) => setPeriodicidade(e.target.value as PeriodicidadeObrigacao)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="MENSAL">Mensal</option>
            <option value="ANUAL">Anual</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="diaVencimento" className="text-sm font-medium text-slate-700">
            Dia de vencimento
          </label>
          <input
            id="diaVencimento"
            name="diaVencimento"
            type="number"
            min={1}
            max={31}
            required
            placeholder="ex.: 20"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>

        {periodicidade === 'ANUAL' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="mesVencimento" className="text-sm font-medium text-slate-700">
              Mês de vencimento
            </label>
            <input
              id="mesVencimento"
              name="mesVencimento"
              type="number"
              min={1}
              max={12}
              required
              placeholder="ex.: 7"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">
          Regimes tributários aplicáveis (nenhum marcado = todos)
        </span>
        <div className="flex flex-wrap gap-3">
          {REGIMES.map((regime) => (
            <label key={regime} className="flex items-center gap-1.5 text-sm text-slate-600">
              <input type="checkbox" name="regimesAplicaveis" value={regime} />
              {regime}
            </label>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  );
}
