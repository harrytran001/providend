import { Pool, PoolClient } from 'pg';
import { config } from '../config';

/**
 * Raw Postgres pool. Use repositories for data access (queries, inserts, etc.).
 */
export const pool = new Pool(config.db);

/**
 * Run a callback inside a DB transaction. On success the transaction is committed;
 * on throw, it is rolled back. The client is always released.
 * Use this when you need to write to multiple tables atomically (all commit or all rollback).
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
