const { Pool } = require('pg');

let pool;
function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

let ensured = false;
async function ensureTable() {
  if (ensured) return;
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  ensured = true;
}

function genId() {
  return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

async function listEntries() {
  await ensureTable();
  const p = getPool();
  const { rows } = await p.query('SELECT id, data FROM entries ORDER BY updated_at DESC');
  return rows.map((r) => ({ id: r.id, ...r.data }));
}

async function createEntry(data, id) {
  await ensureTable();
  const p = getPool();
  const docId = id || genId();
  await p.query(
    'INSERT INTO entries (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data',
    [docId, data]
  );
  return docId;
}

async function updateEntry(id, patch) {
  await ensureTable();
  const p = getPool();
  const { rows } = await p.query('SELECT data FROM entries WHERE id = $1', [id]);
  if (!rows.length) {
    const err = new Error('Entry not found: ' + id);
    err.code = 'not_found';
    throw err;
  }
  const merged = { ...rows[0].data, ...patch };
  await p.query('UPDATE entries SET data = $2, updated_at = now() WHERE id = $1', [id, merged]);
  return merged;
}

async function deleteEntry(id) {
  await ensureTable();
  const p = getPool();
  await p.query('DELETE FROM entries WHERE id = $1', [id]);
}

module.exports = { listEntries, createEntry, updateEntry, deleteEntry, getPool, ensureTable };
