import request from 'supertest';
import express from 'express';
import { mockAuth } from '../middleware/mockAuth';
import { notesRouter } from './notes';

jest.mock('../repositories/assignmentRepository');
jest.mock('../services/noteService');

import * as assignmentRepository from '../repositories/assignmentRepository';
import * as noteService from '../services/noteService';

const mockIsAssigned = assignmentRepository.isAssigned as jest.MockedFunction<typeof assignmentRepository.isAssigned>;
const mockListNotes = noteService.listNotes as jest.MockedFunction<typeof noteService.listNotes>;
const mockAddNote = noteService.addNote as jest.MockedFunction<typeof noteService.addNote>;

const app = express();
app.use(express.json());
app.use('/api', mockAuth, notesRouter);

describe('Notes routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAssigned.mockResolvedValue(true);
  });

  describe('GET /api/clients/:clientId/notes', () => {
    it('returns 200 and notes when user is assigned', async () => {
      const notes = [
        { id: 'n1', clientId: 'c1', authorId: 'user-1', content: 'Hi', createdAt: '2025-01-01T00:00:00.000Z' },
      ];
      mockListNotes.mockResolvedValue(notes);

      const res = await request(app)
        .get('/api/clients/c1/notes')
        .set('X-Author-Id', 'user-1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(notes);
      expect(mockIsAssigned).toHaveBeenCalledWith('c1', 'user-1');
      expect(mockListNotes).toHaveBeenCalledWith('c1');
    });

    it('returns 403 when user is not assigned', async () => {
      mockIsAssigned.mockResolvedValue(false);

      const res = await request(app)
        .get('/api/clients/c1/notes')
        .set('X-Author-Id', 'user-2');

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: 'Not authorized for this client' });
      expect(mockListNotes).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/clients/:clientId/notes', () => {
    it('returns 201 and created note when assigned and body valid', async () => {
      const created = {
        id: 'n2',
        clientId: 'c1',
        authorId: 'user-1',
        content: 'New note',
        createdAt: '2025-01-02T00:00:00.000Z',
      };
      mockAddNote.mockResolvedValue(created);

      const res = await request(app)
        .post('/api/clients/c1/notes')
        .set('X-Author-Id', 'user-1')
        .send({ content: 'New note' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
      expect(mockAddNote).toHaveBeenCalledWith('c1', 'user-1', 'New note');
    });

    it('returns 403 when user is not assigned', async () => {
      mockIsAssigned.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/clients/c1/notes')
        .set('X-Author-Id', 'user-2')
        .send({ content: 'Hello' });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: 'Not authorized for this client' });
      expect(mockAddNote).not.toHaveBeenCalled();
    });

    it('returns 400 when content is missing', async () => {
      const res = await request(app)
        .post('/api/clients/c1/notes')
        .set('X-Author-Id', 'user-1')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/content/i);
      expect(mockAddNote).not.toHaveBeenCalled();
    });

    it('returns 400 when content is empty string', async () => {
      const res = await request(app)
        .post('/api/clients/c1/notes')
        .set('X-Author-Id', 'user-1')
        .send({ content: '' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(mockAddNote).not.toHaveBeenCalled();
    });
  });
});
