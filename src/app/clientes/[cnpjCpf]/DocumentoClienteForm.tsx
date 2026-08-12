'use client';

import { useActionState } from 'react';
import type { TipoDocumento } from '@/lib/types';
import { createDocumentoClienteAction, DocumentoClienteFormState } from './documentos-actions';

const initialState: DocumentoClienteFormState = {};

export function DocumentoClienteForm({
  clienteId,
  cnpjCpf,
  tipos,
}: {
  clienteId: string;
  cnpjCpf: string;
  tipos: TipoDocumento[];
}) {
  const action = createDocumentoClienteAction.bind(null, clienteId, cnpjCpf);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid grid-cols-4 gap-3 rounded-md border border-slate-200 p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="tipoDocumentoId" className="text-xs font-medium text-slate-700">
          Tipo de documento
        </label>
        <select
          id="tipoDocumentoId"
          name="tipoDocumentoId"
          required
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="">Selecione...</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="dataEmissao" className="text-xs font-medium text-slate-700">
          Emissão
        </label>
        <input
          id="dataEmissao"
          name="dataEmissao"
          type="date"
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="dataVencimento" className="text-xs font-medium text-slate-700">
          Vencimento <span className="text-red-500">*</span>
        </label>
        <input
          id="dataVencimento"
          name="dataVencimento"
          type="date"
          required
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
        {pending ? 'Adicionando...' : 'Adicionar documento'}
      </button>
    </form>
  );
}
