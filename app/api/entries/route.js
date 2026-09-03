import { NextResponse } from 'next/server';
import { listEntries, createEntry } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export async function GET(req) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  try {
    const entries = await listEntries();
    return NextResponse.json({ entries });
  } catch (err) {
    console.error('GET /api/entries failed', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  try {
    const body = await req.json();
    const id = await createEntry(body);
    return NextResponse.json({ id });
  } catch (err) {
    console.error('POST /api/entries failed', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
