import * as noteRepository from '../repositories/noteRepository';
import { addNote, listNotes } from './noteService';

jest.mock('../repositories/noteRepository');
jest.mock('../lib/logger', () => ({ log: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() } }));

const mockFindByClientId = noteRepository.findByClientId as jest.MockedFunction<typeof noteRepository.findByClientId>;
const mockCreate = noteRepository.create as jest.MockedFunction<typeof noteRepository.create>;

describe('noteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listNotes', () => {
    it('returns notes from repository for clientId', async () => {
      const notes = [
        {
          id: 'n1',
          clientId: 'c1',
          authorId: 'user-1',
          content: 'Hello',
          createdAt: '2025-01-01T00:00:00.000Z',
        },
      ];
      mockFindByClientId.mockResolvedValue(notes);

      const result = await listNotes('c1');

      expect(mockFindByClientId).toHaveBeenCalledWith('c1');
      expect(result).toEqual(notes);
    });

    it('returns empty array when client has no notes', async () => {
      mockFindByClientId.mockResolvedValue([]);

      const result = await listNotes('c2');

      expect(result).toEqual([]);
    });
  });

  describe('addNote', () => {
    it('creates note and returns it', async () => {
      const created = {
        id: 'n2',
        clientId: 'c1',
        authorId: 'user-1',
        content: 'New note',
        createdAt: '2025-01-02T00:00:00.000Z',
      };
      mockCreate.mockResolvedValue(created);

      const result = await addNote('c1', 'user-1', 'New note');

      expect(mockCreate).toHaveBeenCalledWith('c1', 'user-1', 'New note');
      expect(result).toEqual(created);
    });
  });
});
