import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuth } from '../../../lib/auth';

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

export async function POST(req) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type: ' + file.type }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large — max 4MB' }, { status: 400 });
    }
    const ext = file.type.split('/')[1] || 'png';
    const key = 'uploads/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    const blob = await put(key, file, { access: 'public' });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('POST /api/upload failed', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
