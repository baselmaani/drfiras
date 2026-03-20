const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  await client.query(`
    ALTER TABLE "Service"
    ADD COLUMN IF NOT EXISTS "heroImage" TEXT,
    ADD COLUMN IF NOT EXISTS "caseImages" TEXT
  `);
  console.log('Migration done: heroImage and caseImages added to Service');
  await client.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
