import Redis from 'ioredis';
import { config } from '../config';

/**
 * Raw Redis client. Use repositories for data access (get, set, cache, etc.).
 */
export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 3000)),
});
