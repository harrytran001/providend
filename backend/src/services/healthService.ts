import { log } from '../lib/logger';
import * as dbRepository from '../repositories/dbRepository';
import * as redisRepository from '../repositories/redisRepository';

export interface HealthResult {
  status: 'ok' | 'degraded';
  timestamp: string;
  services: {
    database: { ok: boolean; latencyMs?: number; error?: string };
    redis: { ok: boolean; latencyMs?: number; error?: string };
  };
}

export async function getHealth(): Promise<HealthResult> {
  log.debug('Health check started');
  const [database, redis] = await Promise.all([
    dbRepository.ping(),
    redisRepository.ping(),
  ]);
  const ok = database.ok && redis.ok;
  if (!ok) {
    log.warn('Health check degraded', { database: database.ok, redis: redis.ok });
  }
  return {
    status: ok ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: { database, redis },
  };
}
