/**
 * E2E tests: real app, real DB, real Redis. No mocks.
 * Prerequisite: start infra first, e.g. docker compose up -d
 */
import request from 'supertest';
import app from '../src/app';

describe('E2E GET /api/health', () => {
  it('returns 200 and status when DB and Redis are up', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.services.database.ok).toBe(true);
    expect(res.body.services.redis.ok).toBe(true);
    expect(res.body.timestamp).toBeDefined();
  }, 10_000);
});
