import { NextResponse } from 'next/server';
import { updateEntry, deleteEntry } from '../../../../lib/db';
import { requireAuth } from '../../../../lib/auth';

export async function PATCH(req, { params }) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  try {
    const patch = await req.json();
    const data = await updateEntry(params.id, patch);
    return NextResponse.json({ data });
  } catch (err) {
    console.error('PATCH /api/entries/[id] failed', err);
    const status = err.code === 'not_found' ? 404 : 500;
    return NextResponse.json({ error: err.message || 'Server error' }, { status });
  }
}

export async function DELETE(req, { params }) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  try {
    await deleteEntry(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/entries/[id] failed', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
