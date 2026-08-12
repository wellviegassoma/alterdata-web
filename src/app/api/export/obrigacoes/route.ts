import ExcelJS from 'exceljs';
import { NextRequest } from 'next/server';
import { apiFetch } from '@/lib/api';
import { requireUser } from '@/lib/require-user';
import type { ObrigacaoCliente } from '@/lib/types';

const STATUS_LABEL: Record<string, string> = {
  VENCIDO: 'Vencido',
  VENCENDO: 'Vencendo',
  OK: 'Pendente',
  CUMPRIDA: 'Cumprida',
};

export async function GET(request: NextRequest) {
  await requireUser();

  const status = request.nextUrl.searchParams.get('status');
  const competencia = request.nextUrl.searchParams.get('competencia');
  const obrigacoes = await apiFetch<ObrigacaoCliente[]>('/obrigacoes-cliente');

  const filtradas = obrigacoes.filter((o) => {
    const statusOk = !status || status === 'TODOS' || o.status === status;
    const competenciaOk =
      !competencia || o.competencia === competencia || o.competencia === competencia.slice(0, 4);
    return statusOk && competenciaOk;
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Obrigações');

  sheet.columns = [
    { header: 'Cliente', key: 'cliente', width: 40 },
    { header: 'CNPJ/CPF', key: 'cnpjCpf', width: 18 },
    { header: 'Obrigação', key: 'tipo', width: 20 },
    { header: 'Competência', key: 'competencia', width: 14 },
    { header: 'Vencimento', key: 'vencimento', width: 14 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Observações', key: 'observacoes', width: 30 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const obrigacao of filtradas) {
    sheet.addRow({
      cliente: obrigacao.cliente.nome || obrigacao.cliente.nomeFantasia || obrigacao.cliente.cnpjCpf,
      cnpjCpf: obrigacao.cliente.cnpjCpf,
      tipo: obrigacao.tipoObrigacao.nome,
      competencia: obrigacao.competencia,
      vencimento: obrigacao.dataVencimento.slice(0, 10),
      status: STATUS_LABEL[obrigacao.status] ?? obrigacao.status,
      observacoes: obrigacao.observacoes ?? '',
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="obrigacoes-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
