/**
 * E2E tests for Notes (core feature): real app, real DB. No mocks.
 * Prerequisite: docker compose up -d, and run migration (pnpm migrate).
 * Seed: clients Acme (user-1 + user-2 assigned), Beta (user-1 only).
 */
import request from 'supertest';
import app from '../src/app';

const ACME_ID = 'a0000000-0000-0000-0000-000000000001';
const BETA_ID = 'a0000000-0000-0000-0000-000000000002';

describe('E2E Notes (core feature)', () => {
  describe('GET /api/clients', () => {
    it('returns 200 and list of clients', async () => {
      const res = await request(app).get('/api/clients');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const names = res.body.map((c: { name: string }) => c.name);
      expect(names).toContain('Acme Corp');
      expect(names).toContain('Beta Inc');
    });
  });

  describe('GET /api/clients/:clientId/notes', () => {
    it('returns 200 and notes when user is assigned (user-1 → Acme)', async () => {
      const res = await request(app)
        .get(`/api/clients/${ACME_ID}/notes`)
        .set('X-Author-Id', 'user-1');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 403 when user is not assigned (user-2 → Beta)', async () => {
      const res = await request(app)
        .get(`/api/clients/${BETA_ID}/notes`)
        .set('X-Author-Id', 'user-2');

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Not authorized for this client');
    });
  });

  describe('POST /api/clients/:clientId/notes', () => {
    it('returns 201 and created note when assigned, then list includes it', async () => {
      const res = await request(app)
        .post(`/api/clients/${ACME_ID}/notes`)
        .set('X-Author-Id', 'user-1')
        .send({ content: 'E2E test note' });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.clientId).toBe(ACME_ID);
      expect(res.body.authorId).toBe('user-1');
      expect(res.body.content).toBe('E2E test note');
      expect(res.body.createdAt).toBeDefined();

      const listRes = await request(app)
        .get(`/api/clients/${ACME_ID}/notes`)
        .set('X-Author-Id', 'user-1');
      expect(listRes.status).toBe(200);
      const found = listRes.body.find((n: { id: string }) => n.id === res.body.id);
      expect(found).toBeDefined();
      expect(found.content).toBe('E2E test note');
    });

    it('returns 403 when user is not assigned (user-2 → Beta)', async () => {
      const res = await request(app)
        .post(`/api/clients/${BETA_ID}/notes`)
        .set('X-Author-Id', 'user-2')
        .send({ content: 'Should fail' });

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Not authorized for this client');
    });

    it('returns 400 when content is missing', async () => {
      const res = await request(app)
        .post(`/api/clients/${ACME_ID}/notes`)
        .set('X-Author-Id', 'user-1')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
