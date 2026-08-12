'use client';

import { useState, useTransition } from 'react';
import { revelarSenhaAction } from './acessos-actions';

export function AcessoSenhaReveal({ id }: { id: string }) {
  const [senha, setSenha] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (senha !== null) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-slate-900">{senha}</span>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(senha)}
          className="text-xs font-medium text-slate-600 hover:underline"
        >
          Copiar
        </button>
        <button
          type="button"
          onClick={() => setSenha(null)}
          className="text-xs font-medium text-slate-600 hover:underline"
        >
          Ocultar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="tracking-widest text-slate-400">••••••••</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setErro(null);
          startTransition(async () => {
            try {
              setSenha(await revelarSenhaAction(id));
            } catch {
              setErro('Falhou');
            }
          });
        }}
        className="text-xs font-medium text-slate-600 hover:underline disabled:opacity-50"
      >
        {pending ? 'Buscando...' : 'Mostrar'}
      </button>
      {erro && <span className="text-xs text-red-600">{erro}</span>}
    </div>
  );
}
