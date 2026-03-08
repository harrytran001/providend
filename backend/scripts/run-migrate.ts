/**
 * Run 001_initial.sql against the configured DB.
 * Usage: npx ts-node scripts/run-migrate.ts (or tsx)
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from '../src/lib/db';

const sql = readFileSync(join(__dirname, '001_initial.sql'), 'utf-8');
pool
  .query(sql)
  .then(() => {
    console.log('Migration 001_initial completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
