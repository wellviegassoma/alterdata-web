import ExcelJS from 'exceljs';
import { NextRequest } from 'next/server';
import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { Cliente } from '@/lib/types';

export async function GET(request: NextRequest) {
  await requireUser();

  const status = request.nextUrl.searchParams.get('status');
  const clientes = await apiFetch<Cliente[]>(
    `/clientes?take=2000${status ? `&status=${status}` : ''}`,
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Clientes');

  sheet.columns = [
    { header: 'Código', key: 'codigo', width: 10 },
    { header: 'Nome', key: 'nome', width: 40 },
    { header: 'Nome fantasia', key: 'nomeFantasia', width: 30 },
    { header: 'CNPJ/CPF', key: 'cnpjCpf', width: 18 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Responsável fiscal', key: 'responsavelFiscal', width: 22 },
    { header: 'Responsável contábil', key: 'responsavelContabil', width: 22 },
    { header: 'Responsável DP', key: 'responsavelDp', width: 22 },
    { header: 'Contato principal', key: 'contato', width: 22 },
    { header: 'Telefone', key: 'telefone', width: 16 },
    { header: 'E-mail', key: 'email', width: 26 },
    { header: 'Regime tributário', key: 'regime', width: 18 },
    { header: 'Capital social', key: 'capitalSocial', width: 16 },
    { header: 'Data de abertura', key: 'dataAbertura', width: 16 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const cliente of clientes) {
    const principal = cliente.contatos.find((c) => c.principal) ?? cliente.contatos[0];
    sheet.addRow({
      codigo: cliente.codigo ?? '',
      nome: cliente.nome ?? '',
      nomeFantasia: cliente.nomeFantasia ?? '',
      cnpjCpf: cliente.cnpjCpf,
      status: cliente.status,
      responsavelFiscal: cliente.responsavelFiscal?.nome ?? '',
      responsavelContabil: cliente.responsavelContabil?.nome ?? '',
      responsavelDp: cliente.responsavelDp?.nome ?? '',
      contato: principal?.nome ?? '',
      telefone: principal?.telefone ?? principal?.whatsapp ?? '',
      email: principal?.email ?? '',
      regime: cliente.dadosFiscais?.regimeTributario ?? '',
      capitalSocial: cliente.dadosFiscais?.capitalSocial ?? '',
      dataAbertura: cliente.dadosFiscais?.dataAbertura?.slice(0, 10) ?? '',
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="clientes-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
