'use client';

import { useActionState } from 'react';
import { EmpresaSearch } from '@/components/EmpresaSearch';
import { ContatosField } from '@/components/ContatosField';
import type { ClienteFormState } from './actions';
import type { Cliente, Usuario } from '@/lib/types';

type Action = (state: ClienteFormState, formData: FormData) => Promise<ClienteFormState>;

interface Props {
  action: Action;
  usuarios: Usuario[];
  cliente?: Cliente;
}

const initialState: ClienteFormState = {};

export function ClienteForm({ action, usuarios, cliente }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const modoEdicao = Boolean(cliente);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-slate-900">Vínculo com o eContador</h2>
        {modoEdicao ? (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">CNPJ/CPF</span>
            <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {cliente!.cnpjCpf} (não pode ser alterado)
            </p>
          </div>
        ) : (
          <EmpresaSearch />
        )}
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-slate-700">
            Status do cliente
          </label>
          <select
            id="status"
            name="status"
            defaultValue={cliente?.status ?? 'ATIVO'}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="ATIVO">Ativo</option>
            <option value="EM_ONBOARDING">Em onboarding</option>
            <option value="EM_OFFBOARDING">Em offboarding</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="responsavelInternoId" className="text-sm font-medium text-slate-700">
            Responsável interno
          </label>
          <select
            id="responsavelInternoId"
            name="responsavelInternoId"
            defaultValue={cliente?.responsavelInternoId ?? ''}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="">Nenhum</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="flex flex-col gap-1">
        <label htmlFor="observacoes" className="text-sm font-medium text-slate-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={2}
          defaultValue={cliente?.observacoes ?? ''}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </section>

      <section className="flex flex-col gap-1">
        <label htmlFor="tags" className="text-sm font-medium text-slate-700">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="separadas por vírgula, ex.: varejo, prioritario"
          defaultValue={cliente?.tags.map((t) => t.tag.nome).join(', ') ?? ''}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Contatos</h2>
        <ContatosField
          defaultContatos={cliente?.contatos.map((c) => ({
            nome: c.nome,
            cargo: c.cargo ?? '',
            telefone: c.telefone ?? '',
            whatsapp: c.whatsapp ?? '',
            email: c.email ?? '',
            principal: c.principal,
          }))}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-slate-900">Endereço</h2>
        <div className="grid grid-cols-3 gap-3">
          <Campo name="cep" label="CEP" defaultValue={cliente?.endereco?.cep ?? ''} />
          <Campo
            name="rua"
            label="Rua"
            defaultValue={cliente?.endereco?.rua ?? ''}
            className="col-span-2"
          />
          <Campo name="numero" label="Número" defaultValue={cliente?.endereco?.numero ?? ''} />
          <Campo
            name="complemento"
            label="Complemento"
            defaultValue={cliente?.endereco?.complemento ?? ''}
          />
          <Campo name="bairro" label="Bairro" defaultValue={cliente?.endereco?.bairro ?? ''} />
          <Campo name="cidade" label="Cidade" defaultValue={cliente?.endereco?.cidade ?? ''} />
          <Campo name="uf" label="UF" defaultValue={cliente?.endereco?.uf ?? ''} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-slate-900">Dados fiscais</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="regimeTributario" className="text-sm font-medium text-slate-700">
              Regime tributário
            </label>
            <select
              id="regimeTributario"
              name="regimeTributario"
              defaultValue={cliente?.dadosFiscais?.regimeTributario ?? ''}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            >
              <option value="">Não informado</option>
              <option value="MEI">MEI</option>
              <option value="SIMPLES_NACIONAL">Simples Nacional</option>
              <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
              <option value="LUCRO_REAL">Lucro Real</option>
              <option value="ISENTO">Isento</option>
            </select>
          </div>
          <Campo
            name="cnaePrincipal"
            label="CNAE principal"
            defaultValue={cliente?.dadosFiscais?.cnaePrincipal ?? ''}
          />
          <Campo
            name="inscricaoEstadual"
            label="Inscrição estadual"
            defaultValue={cliente?.dadosFiscais?.inscricaoEstadual ?? ''}
          />
          <Campo
            name="inscricaoMunicipal"
            label="Inscrição municipal"
            defaultValue={cliente?.dadosFiscais?.inscricaoMunicipal ?? ''}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-slate-900">Contrato</h2>
        <div className="grid grid-cols-2 gap-3">
          <Campo
            name="valorHonorarios"
            label="Valor dos honorários (R$)"
            type="number"
            step="0.01"
            defaultValue={cliente?.contrato?.valorHonorarios ?? ''}
          />
          <Campo
            name="diaVencimento"
            label="Dia de vencimento"
            type="number"
            min={1}
            max={31}
            defaultValue={cliente?.contrato?.diaVencimento ?? ''}
          />
          <Campo
            name="formaPagamento"
            label="Forma de pagamento"
            defaultValue={cliente?.contrato?.formaPagamento ?? ''}
          />
          <Campo
            name="dataInicio"
            label="Início do contrato"
            type="date"
            defaultValue={cliente?.contrato?.dataInicio?.slice(0, 10) ?? ''}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="contratoStatus" className="text-sm font-medium text-slate-700">
              Status do contrato
            </label>
            <select
              id="contratoStatus"
              name="contratoStatus"
              defaultValue={cliente?.contrato?.status ?? 'ATIVO'}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            >
              <option value="ATIVO">Ativo</option>
              <option value="SUSPENSO">Suspenso</option>
              <option value="ENCERRADO">Encerrado</option>
            </select>
          </div>
          <Campo
            name="contratoObservacoes"
            label="Observações do contrato"
            defaultValue={cliente?.contrato?.observacoes ?? ''}
            className="col-span-2"
          />
        </div>
      </section>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? 'Salvando...' : modoEdicao ? 'Salvar alterações' : 'Cadastrar cliente'}
      </button>
    </form>
  );
}

function Campo({
  name,
  label,
  defaultValue,
  type = 'text',
  className,
  ...rest
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        {...rest}
      />
    </div>
  );
}
