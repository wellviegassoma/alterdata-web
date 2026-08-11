'use client';

import { useEffect, useState } from 'react';
import type { EmpresaResumo } from '@/lib/types';

interface Props {
  defaultEmpresaId?: string;
  defaultCnpjCpf?: string;
  cnpjCpfEditavel?: boolean;
}

/**
 * Busca empresas do eContador por nome/CNPJ e preenche alterdataEmpresaId +
 * cnpjCpf ao selecionar. Os dois campos ficam disponíveis via inputs hidden
 * (lidos pelo Server Action no submit do formulário).
 */
export function EmpresaSearch({ defaultEmpresaId, defaultCnpjCpf, cnpjCpfEditavel = true }: Props) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<EmpresaResumo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [selecionada, setSelecionada] = useState<EmpresaResumo | null>(
    defaultEmpresaId && defaultCnpjCpf
      ? { id: defaultEmpresaId, nome: '', cpfCnpjAlfanumerico: defaultCnpjCpf, ativa: true }
      : null,
  );
  const [cnpjManual, setCnpjManual] = useState(defaultCnpjCpf ?? '');

  useEffect(() => {
    if (query.trim().length < 2) {
      setResultados([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setCarregando(true);
      try {
        const res = await fetch(`/api/empresas/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResultados(Array.isArray(data) ? data : []);
      } finally {
        setCarregando(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="alterdataEmpresaId" value={selecionada?.id ?? ''} />
      <input type="hidden" name="nome" value={selecionada?.nome ?? ''} />

      {selecionada ? (
        <div className="flex items-center justify-between rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
          <span>
            {selecionada.nome || 'Empresa selecionada'}{' '}
            <span className="text-slate-500">({selecionada.cpfCnpjAlfanumerico})</span>
          </span>
          <button
            type="button"
            onClick={() => setSelecionada(null)}
            className="text-xs font-medium text-slate-500 hover:text-slate-900"
          >
            Trocar
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ da empresa no eContador..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          {carregando && <p className="mt-1 text-xs text-slate-400">Buscando...</p>}
          {resultados.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md">
              {resultados.map((empresa) => (
                <li key={empresa.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelecionada(empresa);
                      setCnpjManual(empresa.cpfCnpjAlfanumerico);
                      setQuery('');
                      setResultados([]);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    {empresa.nome} <span className="text-slate-500">({empresa.cpfCnpjAlfanumerico})</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="cnpjCpf" className="text-sm font-medium text-slate-700">
          CNPJ/CPF <span className="text-red-500">*</span>
        </label>
        <input
          id="cnpjCpf"
          name="cnpjCpf"
          type="text"
          required
          readOnly={!cnpjCpfEditavel}
          value={cnpjManual}
          onChange={(e) => setCnpjManual(e.target.value)}
          placeholder="Preenchido ao buscar a empresa, ou digite manualmente"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none read-only:bg-slate-50"
        />
        <p className="text-xs text-slate-400">
          Busque a empresa acima para vincular automaticamente ao eContador, ou digite o CNPJ/CPF
          manualmente se ela ainda não estiver lá.
        </p>
      </div>
    </div>
  );
}
