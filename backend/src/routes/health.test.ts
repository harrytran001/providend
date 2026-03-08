import request from 'supertest';
import express from 'express';
import { healthRouter } from './health';

jest.mock('../repositories/dbRepository', () => ({
  ping: jest.fn().mockResolvedValue({ ok: true, latencyMs: 1 }),
}));
jest.mock('../repositories/redisRepository', () => ({
  ping: jest.fn().mockResolvedValue({ ok: true, latencyMs: 1 }),
}));

const app = express();
app.use('/api/health', healthRouter);

describe('GET /api/health', () => {
  it('returns 200 and status when all services are ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      services: {
        database: { ok: true },
        redis: { ok: true },
      },
    });
    expect(res.body.timestamp).toBeDefined();
  });
});
