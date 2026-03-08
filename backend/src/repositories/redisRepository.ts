import { redis } from '../lib/redis';
import { log } from '../lib/logger';

export interface PingResult {
  ok: boolean;
  latencyMs?: number;
  error?: string;
}

/**
 * Encapsulates Redis access. Add get/set/cache methods here.
 * Services call the repository instead of using the client directly.
 */
export async function ping(): Promise<PingResult> {
  const start = Date.now();
  try {
    await redis.ping();
    const latencyMs = Date.now() - start;
    log.debug('Redis ping ok', { latencyMs });
    return { ok: true, latencyMs };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    log.error('Redis ping failed', { error, latencyMs: Date.now() - start });
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error,
    };
  }
}
