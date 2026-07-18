import { NextRequest, NextResponse } from 'next/server';
import { syncPrintfulProducts } from '@/lib/printful';

export async function POST(req: NextRequest) {
  const secret = process.env.SYNC_SECRET;
  const provided = req.headers.get('x-sync-secret');

  if (secret && provided !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncPrintfulProducts();
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
