'use client';

import { useState } from 'react';

interface ContatoRow {
  nome: string;
  cargo: string;
  telefone: string;
  whatsapp: string;
  email: string;
  principal: boolean;
}

const VAZIO: ContatoRow = { nome: '', cargo: '', telefone: '', whatsapp: '', email: '', principal: false };

export function ContatosField({ defaultContatos }: { defaultContatos?: ContatoRow[] }) {
  const [contatos, setContatos] = useState<ContatoRow[]>(
    defaultContatos && defaultContatos.length > 0 ? defaultContatos : [{ ...VAZIO, principal: true }],
  );

  function atualizar(index: number, campo: keyof ContatoRow, valor: string | boolean) {
    setContatos((atual) => atual.map((c, i) => (i === index ? { ...c, [campo]: valor } : c)));
  }

  function adicionar() {
    setContatos((atual) => [...atual, { ...VAZIO }]);
  }

  function remover(index: number) {
    setContatos((atual) => atual.filter((_, i) => i !== index));
  }

  const contatosValidos = contatos.filter((c) => c.nome.trim() !== '');

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="contatosJson" value={JSON.stringify(contatosValidos)} />

      {contatos.map((contato, index) => (
        <div key={index} className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 p-3">
          <input
            type="text"
            placeholder="Nome"
            value={contato.nome}
            onChange={(e) => atualizar(index, 'nome', e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Cargo"
            value={contato.cargo}
            onChange={(e) => atualizar(index, 'cargo', e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Telefone"
            value={contato.telefone}
            onChange={(e) => atualizar(index, 'telefone', e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="WhatsApp"
            value={contato.whatsapp}
            onChange={(e) => atualizar(index, 'whatsapp', e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={contato.email}
            onChange={(e) => atualizar(index, 'email', e.target.value)}
            className="col-span-2 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
          />
          <label className="col-span-2 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={contato.principal}
              onChange={(e) => atualizar(index, 'principal', e.target.checked)}
            />
            Contato principal
          </label>
          {contatos.length > 1 && (
            <button
              type="button"
              onClick={() => remover(index)}
              className="col-span-2 text-left text-xs font-medium text-red-600 hover:underline"
            >
              Remover
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={adicionar}
        className="self-start text-sm font-medium text-slate-700 hover:underline"
      >
        + Adicionar outro contato
      </button>
    </div>
  );
}
