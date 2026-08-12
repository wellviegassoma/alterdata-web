'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ClienteResumo {
  id: string;
  codigo: string | null;
  nome: string | null;
  nomeFantasia: string | null;
  cnpjCpf: string;
}

export function ClienteQuickSearch({ clientes }: { clientes: ClienteResumo[] }) {
  const router = useRouter();
  const [termo, setTermo] = useState('');
  const [aberto, setAberto] = useState(false);

  const resultados = useMemo(() => {
    const q = termo.trim().toLowerCase();
    if (!q) return [];
    return clientes
      .filter(
        (c) =>
          (c.nome ?? '').toLowerCase().includes(q) ||
          (c.nomeFantasia ?? '').toLowerCase().includes(q) ||
          c.cnpjCpf.includes(q) ||
          (c.codigo ?? '').toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [termo, clientes]);

  return (
    <div className="relative">
      <input
        type="text"
        value={termo}
        onChange={(e) => {
          setTermo(e.target.value);
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
        onBlur={() => setTimeout(() => setAberto(false), 150)}
        placeholder="Buscar por nome, código ou CNPJ/CPF..."
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
      {aberto && resultados.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
          {resultados.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseDown={() => router.push(`/?cliente=${c.cnpjCpf}`)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">
                  {c.nome || c.nomeFantasia || c.cnpjCpf}
                </span>
                <span className="text-slate-500">
                  {' '}
                  — {c.codigo ?? '—'} — {c.cnpjCpf}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
