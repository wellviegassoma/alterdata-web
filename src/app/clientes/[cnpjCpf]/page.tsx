import Link from 'next/link';
import { apiFetch, ApiError } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { ClienteCompleto, DocumentoCliente, StatusVencimento, TipoDocumento } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton';
import { deleteClienteAction } from '../actions';
import { DocumentoClienteForm } from './DocumentoClienteForm';
import { deleteDocumentoClienteAction } from './documentos-actions';

const STATUS_DOC_ESTILO: Record<StatusVencimento, string> = {
  VENCIDO: 'bg-red-100 text-red-700',
  VENCENDO: 'bg-amber-100 text-amber-700',
  OK: 'bg-emerald-100 text-emerald-700',
};

const STATUS_DOC_LABEL: Record<StatusVencimento, string> = {
  VENCIDO: 'Vencido',
  VENCENDO: 'Vencendo',
  OK: 'Em dia',
};

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ cnpjCpf: string }>;
}) {
  const { cnpjCpf } = await params;
  const user = await requireUser();

  let completo: ClienteCompleto;
  try {
    completo = await apiFetch<ClienteCompleto>(`/clientes/${cnpjCpf}/completo`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <div className="flex min-h-screen flex-col">
          <AppHeader user={user} />
          <main className="mx-auto w-full max-w-3xl px-6 py-8">
            <p className="text-sm text-slate-500">Cliente não encontrado.</p>
          </main>
        </div>
      );
    }
    throw error;
  }

  const { econtador, local } = completo;
  const removerComCnpj = deleteClienteAction.bind(null, cnpjCpf);

  const [documentos, tiposDocumento] = await Promise.all([
    apiFetch<DocumentoCliente[]>(`/documentos-cliente?clienteId=${local.id}`),
    apiFetch<TipoDocumento[]>('/tipos-documento'),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {econtador?.nome || econtador?.nomeFantasia || cnpjCpf}
            </h1>
            <p className="text-sm text-slate-500">{cnpjCpf}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/clientes/${cnpjCpf}/editar`}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Editar
            </Link>
            <form action={removerComCnpj}>
              <ConfirmSubmitButton
                confirmMessage="Remover este cliente? Isso não afeta o cadastro no eContador."
                className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remover
              </ConfirmSubmitButton>
            </form>
          </div>
        </div>

        {econtador ? (
          <Secao titulo="Dados do eContador">
            <Campo label="Razão social" valor={econtador.nome} />
            <Campo label="Nome fantasia" valor={econtador.nomeFantasia} />
            <Campo label="Código" valor={econtador.codigo} />
            <Campo label="CNPJ/CPF" valor={econtador.cpfCnpjAlfanumerico} />
            <Campo label="Ativa no eContador" valor={econtador.ativa ? 'Sim' : 'Não'} />
            <Campo label="Endereço (eContador)" valor={econtador.endereco as string | undefined} />
          </Secao>
        ) : (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Não foi possível carregar os dados do eContador para este cliente (verifique se o
            vínculo com a empresa Alterdata está correto).
          </p>
        )}

        <Secao titulo="Status e responsáveis">
          <Campo label="Código" valor={local.codigo} />
          <Campo label="Status" valor={local.status} />
          <Campo label="Responsável Fiscal" valor={local.responsavelFiscal?.nome} />
          <Campo label="Responsável Contábil" valor={local.responsavelContabil?.nome} />
          <Campo label="Responsável DP" valor={local.responsavelDp?.nome} />
          <Campo label="Observações" valor={local.observacoes} />
          <Campo
            label="Tags"
            valor={local.tags.length ? local.tags.map((t) => t.tag.nome).join(', ') : undefined}
          />
        </Secao>

        {local.contatos.length > 0 && (
          <Secao titulo="Contatos">
            <div className="col-span-2 flex flex-col gap-2">
              {local.contatos.map((c) => (
                <div key={c.id} className="rounded-md border border-slate-100 p-3 text-sm">
                  <p className="font-medium text-slate-900">
                    {c.nome} {c.principal && <span className="text-xs text-slate-500">(principal)</span>}
                  </p>
                  <p className="text-slate-600">
                    {[c.cargo, c.telefone, c.whatsapp, c.email].filter(Boolean).join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </Secao>
        )}

        {local.endereco && (
          <Secao titulo="Endereço">
            <Campo label="CEP" valor={local.endereco.cep} />
            <Campo label="Rua" valor={local.endereco.rua} />
            <Campo label="Número" valor={local.endereco.numero} />
            <Campo label="Complemento" valor={local.endereco.complemento} />
            <Campo label="Bairro" valor={local.endereco.bairro} />
            <Campo label="Cidade" valor={local.endereco.cidade} />
            <Campo label="UF" valor={local.endereco.uf} />
          </Secao>
        )}

        {local.dadosFiscais && (
          <Secao titulo="Dados fiscais e registrais">
            <Campo label="Regime tributário" valor={local.dadosFiscais.regimeTributario} />
            <Campo label="CNAE principal" valor={local.dadosFiscais.cnaePrincipal} />
            <Campo label="Inscrição estadual" valor={local.dadosFiscais.inscricaoEstadual} />
            <Campo label="Inscrição municipal" valor={local.dadosFiscais.inscricaoMunicipal} />
            <Campo
              label="Capital social"
              valor={local.dadosFiscais.capitalSocial ? `R$ ${local.dadosFiscais.capitalSocial}` : undefined}
            />
            <Campo label="Data de abertura" valor={local.dadosFiscais.dataAbertura?.slice(0, 10)} />
          </Secao>
        )}

        {local.contrato && (
          <Secao titulo="Contrato">
            <Campo
              label="Honorários"
              valor={local.contrato.valorHonorarios ? `R$ ${local.contrato.valorHonorarios}` : undefined}
            />
            <Campo label="Dia de vencimento" valor={local.contrato.diaVencimento?.toString()} />
            <Campo label="Forma de pagamento" valor={local.contrato.formaPagamento} />
            <Campo label="Início" valor={local.contrato.dataInicio?.slice(0, 10)} />
            <Campo label="Status do contrato" valor={local.contrato.status} />
            <Campo label="Observações" valor={local.contrato.observacoes} />
          </Secao>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Documentos controlados</h2>

          {tiposDocumento.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum tipo de documento cadastrado ainda.{' '}
              <Link href="/tipos-documento" className="font-medium text-slate-900 hover:underline">
                Cadastrar tipos de documento
              </Link>
              .
            </p>
          ) : (
            <DocumentoClienteForm clienteId={local.id} cnpjCpf={cnpjCpf} tipos={tiposDocumento} />
          )}

          {documentos.length > 0 && (
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-medium">Tipo</th>
                  <th className="py-2 font-medium">Vencimento</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Observações</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc) => {
                  const remover = deleteDocumentoClienteAction.bind(null, doc.id, cnpjCpf);
                  return (
                    <tr key={doc.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 text-slate-900">{doc.tipoDocumento.nome}</td>
                      <td className="py-2 text-slate-600">{doc.dataVencimento.slice(0, 10)}</td>
                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_DOC_ESTILO[doc.status]}`}
                        >
                          {STATUS_DOC_LABEL[doc.status]}
                          {doc.status !== 'OK' && ` · ${Math.abs(doc.diasRestantes)}d`}
                        </span>
                      </td>
                      <td className="py-2 text-slate-600">{doc.observacoes ?? '—'}</td>
                      <td className="py-2 text-right">
                        <form action={remover}>
                          <ConfirmSubmitButton
                            confirmMessage="Remover este documento controlado?"
                            className="text-xs font-medium text-red-600 hover:underline"
                          >
                            Remover
                          </ConfirmSubmitButton>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{titulo}</h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </section>
  );
}

function Campo({ label, valor }: { label: string; valor?: string | null }) {
  if (!valor) return null;
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-800">{valor}</p>
    </div>
  );
}
