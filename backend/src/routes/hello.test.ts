import request from 'supertest';
import express from 'express';
import { helloRouter } from './hello';

const app = express();
app.use('/api/hello', helloRouter);

describe('GET /api/hello', () => {
  it('returns 200 and greeting with timestamp', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      message: 'Hello from Providend API',
      environment: expect.any(String),
    });
    expect(res.body.timestamp).toBeDefined();
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });
});
