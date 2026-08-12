import { apiFetch } from '@/lib/api';
import { requireAdmin } from '@/lib/require-user';

export async function GET() {
  await requireAdmin();

  const dump = await apiFetch<unknown>('/backup');

  return new Response(JSON.stringify(dump, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="backup-soma-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
