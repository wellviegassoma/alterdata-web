export type PapelUsuario = 'ADMIN' | 'CONTADOR' | 'ANALISTA';
export type StatusCliente = 'ATIVO' | 'EM_ONBOARDING' | 'EM_OFFBOARDING' | 'INATIVO';
export type RegimeTributario =
  | 'MEI'
  | 'SIMPLES_NACIONAL'
  | 'LUCRO_PRESUMIDO'
  | 'LUCRO_REAL'
  | 'ISENTO';
export type StatusContrato = 'ATIVO' | 'SUSPENSO' | 'ENCERRADO';

export interface AuthenticatedUser {
  id: string;
  email: string;
  papel: PapelUsuario;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  createdAt: string;
  updatedAt: string;
}

export interface Contato {
  id: string;
  nome: string;
  cargo: string | null;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  principal: boolean;
}

export interface Endereco {
  cep: string | null;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
}

export interface DadosFiscais {
  regimeTributario: RegimeTributario | null;
  cnaePrincipal: string | null;
  inscricaoEstadual: string | null;
  inscricaoMunicipal: string | null;
  /** Não vem do eContador — preenchido manualmente. */
  capitalSocial: string | null;
  /** Não vem do eContador — preenchido manualmente. */
  dataAbertura: string | null;
}

export interface Contrato {
  valorHonorarios: string | null;
  diaVencimento: number | null;
  formaPagamento: string | null;
  dataInicio: string | null;
  status: StatusContrato;
  observacoes: string | null;
}

export interface Cliente {
  id: string;
  cnpjCpf: string;
  alterdataEmpresaId: string | null;
  nome: string | null;
  nomeFantasia: string | null;
  codigo: string | null;
  status: StatusCliente;
  observacoes: string | null;
  responsavelFiscalId: string | null;
  responsavelFiscal: { id: string; nome: string; email: string; papel: PapelUsuario } | null;
  responsavelContabilId: string | null;
  responsavelContabil: { id: string; nome: string; email: string; papel: PapelUsuario } | null;
  responsavelDpId: string | null;
  responsavelDp: { id: string; nome: string; email: string; papel: PapelUsuario } | null;
  contatos: Contato[];
  endereco: Endereco | null;
  dadosFiscais: DadosFiscais | null;
  contrato: Contrato | null;
  tags: { tag: { id: string; nome: string } }[];
  createdAt: string;
  updatedAt: string;
}

/** Campos do eContador retornados por GET /empresas/:id/completa (formato solto, vem da Alterdata). */
export interface EmpresaEcontador {
  id: string;
  nome: string;
  nomeFantasia?: string;
  codigo?: string;
  ativa: boolean;
  cpfcnpj: number;
  cpfCnpjAlfanumerico: string;
  isCpf: boolean | null;
  endereco?: string;
  externoid?: string;
  [key: string]: unknown;
}

export interface ClienteCompleto {
  econtador: EmpresaEcontador | null;
  local: Cliente;
}

export interface EmpresaResumo {
  id: string;
  nome: string;
  cpfCnpjAlfanumerico: string;
  ativa: boolean;
}
