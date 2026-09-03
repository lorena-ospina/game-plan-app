const fs = require('fs');
const path = require('path');
const { createEntry, ensureTable, getPool } = require('../lib/db');

const EXPORT_DIR = path.join(__dirname, '..', 'data', 'entries');

async function main() {
  if (!fs.existsSync(EXPORT_DIR)) {
    console.error('No export directory found at ' + EXPORT_DIR);
    process.exit(1);
  }
  await ensureTable();
  const files = fs.readdirSync(EXPORT_DIR).filter((f) => f.endsWith('.json'));
  console.log('Seeding ' + files.length + ' entries...');
  for (const file of files) {
    const id = path.basename(file, '.json');
    const raw = JSON.parse(fs.readFileSync(path.join(EXPORT_DIR, file), 'utf8'));
    const { id: _drop, ...data } = raw;
    await createEntry(data, id);
    console.log('  seeded ' + id);
  }
  console.log('Done.');
  await getPool().end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
