import ExcelJS from 'exceljs';
import { NextRequest } from 'next/server';
import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { DocumentoCliente } from '@/lib/types';

const STATUS_LABEL: Record<string, string> = {
  VENCIDO: 'Vencido',
  VENCENDO: 'Vencendo',
  OK: 'Em dia',
};

export async function GET(request: NextRequest) {
  await requireUser();

  const status = request.nextUrl.searchParams.get('status');
  const documentos = await apiFetch<DocumentoCliente[]>('/documentos-cliente');
  const filtrados =
    status && status !== 'TODOS' ? documentos.filter((d) => d.status === status) : documentos;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Documentos');

  sheet.columns = [
    { header: 'Cliente', key: 'cliente', width: 40 },
    { header: 'CNPJ/CPF', key: 'cnpjCpf', width: 18 },
    { header: 'Tipo de documento', key: 'tipo', width: 26 },
    { header: 'Emissão', key: 'emissao', width: 14 },
    { header: 'Vencimento', key: 'vencimento', width: 14 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Dias restantes', key: 'dias', width: 14 },
    { header: 'Observações', key: 'observacoes', width: 30 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const doc of filtrados) {
    sheet.addRow({
      cliente: doc.cliente.nome || doc.cliente.nomeFantasia || doc.cliente.cnpjCpf,
      cnpjCpf: doc.cliente.cnpjCpf,
      tipo: doc.tipoDocumento.nome,
      emissao: doc.dataEmissao?.slice(0, 10) ?? '',
      vencimento: doc.dataVencimento.slice(0, 10),
      status: STATUS_LABEL[doc.status] ?? doc.status,
      dias: doc.diasRestantes,
      observacoes: doc.observacoes ?? '',
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="documentos-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
