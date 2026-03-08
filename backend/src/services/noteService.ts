import { log } from '../lib/logger';
import * as noteRepository from '../repositories/noteRepository';
import type { Note } from '../types/notes';

/**
 * List notes for a client. Caller must ensure assignment (e.g. requireClientAssignment middleware).
 */
export async function listNotes(clientId: string): Promise<Note[]> {
  return noteRepository.findByClientId(clientId);
}

/**
 * Add a note for a client. Caller must ensure assignment (e.g. requireClientAssignment middleware).
 */
export async function addNote(clientId: string, authorId: string, content: string): Promise<Note> {
  const note = await noteRepository.create(clientId, authorId, content);
  log.info('Note added', { noteId: note.id, clientId, authorId });
  return note;
}
