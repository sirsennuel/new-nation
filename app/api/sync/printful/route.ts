import { NextRequest, NextResponse } from 'next/server';
import { syncPrintfulProducts } from '@/lib/printful';

export async function POST(_req: NextRequest) {
  try {
    const result = await syncPrintfulProducts();
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}