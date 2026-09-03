const COOKIE_NAME = 'gp_session';

async function makeToken(password) {
  const enc = new TextEncoder();
  const data = enc.encode('gameplan-session-v1:' + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Returns a 401 Response if unauthorized, or null if the request may proceed.
async function requireAuth(req) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null; // no password configured — open (local dev convenience)
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  const expected = await makeToken(password);
  if (cookie !== expected) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return null;
}

module.exports = { COOKIE_NAME, makeToken, requireAuth };
