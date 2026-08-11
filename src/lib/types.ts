export interface AuthenticatedUser {
  id: string;
  email: string;
  papel: 'ADMIN' | 'CONTADOR' | 'ANALISTA';
}

export interface Cliente {
  id: string;
  cnpjCpf: string;
  alterdataEmpresaId: string | null;
  status: 'ATIVO' | 'EM_ONBOARDING' | 'EM_OFFBOARDING' | 'INATIVO';
  observacoes: string | null;
  createdAt: string;
  contatos: { id: string; nome: string; email: string | null; principal: boolean }[];
}
