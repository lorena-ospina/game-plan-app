import { NextResponse } from 'next/server';
import { makeToken, COOKIE_NAME } from '../../../lib/auth';

export async function POST(req) {
  const password = process.env.SITE_PASSWORD;
  const { password: submitted } = await req.json();

  if (!password || submitted !== password) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = await makeToken(password);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
