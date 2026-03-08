import { getHealth } from './healthService';
import * as dbRepository from '../repositories/dbRepository';
import * as redisRepository from '../repositories/redisRepository';

jest.mock('../repositories/dbRepository');
jest.mock('../repositories/redisRepository');

const mockDbPing = dbRepository.ping as jest.MockedFunction<typeof dbRepository.ping>;
const mockRedisPing = redisRepository.ping as jest.MockedFunction<typeof redisRepository.ping>;

describe('healthService.getHealth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbPing.mockResolvedValue({ ok: true, latencyMs: 1 });
    mockRedisPing.mockResolvedValue({ ok: true, latencyMs: 2 });
  });

  it('returns status "ok" when database and redis are ok', async () => {
    const result = await getHealth();

    expect(result.status).toBe('ok');
    expect(result.services.database).toEqual({ ok: true, latencyMs: 1 });
    expect(result.services.redis).toEqual({ ok: true, latencyMs: 2 });
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    expect(mockDbPing).toHaveBeenCalledTimes(1);
    expect(mockRedisPing).toHaveBeenCalledTimes(1);
  });

  it('returns status "degraded" when database fails', async () => {
    mockDbPing.mockResolvedValue({ ok: false, latencyMs: 100, error: 'Connection refused' });

    const result = await getHealth();

    expect(result.status).toBe('degraded');
    expect(result.services.database.ok).toBe(false);
    expect(result.services.database.error).toBe('Connection refused');
    expect(result.services.redis.ok).toBe(true);
  });

  it('returns status "degraded" when redis fails', async () => {
    mockRedisPing.mockResolvedValue({ ok: false, latencyMs: 50, error: 'Timeout' });

    const result = await getHealth();

    expect(result.status).toBe('degraded');
    expect(result.services.database.ok).toBe(true);
    expect(result.services.redis.ok).toBe(false);
    expect(result.services.redis.error).toBe('Timeout');
  });

  it('returns status "degraded" when both fail', async () => {
    mockDbPing.mockResolvedValue({ ok: false, error: 'DB down' });
    mockRedisPing.mockResolvedValue({ ok: false, error: 'Redis down' });

    const result = await getHealth();

    expect(result.status).toBe('degraded');
    expect(result.services.database.ok).toBe(false);
    expect(result.services.redis.ok).toBe(false);
  });
});
