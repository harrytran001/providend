/**
 * E2E tests: real app. No mocks.
 */
import request from 'supertest';
import app from '../src/app';

describe('E2E GET /api/hello', () => {
  it('returns 200 and greeting', async () => {
    const res = await request(app).get('/api/hello');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hello from Providend API');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.environment).toBeDefined();
  });
});
