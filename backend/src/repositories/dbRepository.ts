import { pool } from '../lib/db';
import { log } from '../lib/logger';

export interface PingResult {
  ok: boolean;
  latencyMs?: number;
  error?: string;
}

/**
 * Encapsulates DB access. Add methods like findById, create, etc. for domain entities.
 * Services call the repository instead of using the pool directly.
 */
export async function ping(): Promise<PingResult> {
  const start = Date.now();
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    const latencyMs = Date.now() - start;
    log.debug('DB ping ok', { latencyMs });
    return { ok: true, latencyMs };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    log.error('DB ping failed', { error, latencyMs: Date.now() - start });
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error,
    };
  }
}
