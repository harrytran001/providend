import { Router, Request, Response } from 'express';
import { requireClientAssignment } from '../middleware/requireClientAssignment';
import * as noteService from '../services/noteService';
import { addNoteBodySchema } from '../validation/notes';

export const notesRouter = Router();

// Assignment check runs once for any route with :clientId (403 if not assigned)
notesRouter.param('clientId', requireClientAssignment);

/** List notes for a client. Assignment already enforced by param middleware. */
notesRouter.get('/clients/:clientId/notes', async (req: Request, res: Response) => {
  const clientId = typeof req.params.clientId === 'string' ? req.params.clientId : req.params.clientId?.[0] ?? '';
  const notes = await noteService.listNotes(clientId);
  res.json(notes);
});

/** Add a note for a client. Assignment already enforced by param middleware. */
notesRouter.post('/clients/:clientId/notes', async (req: Request, res: Response) => {
  const parsed = addNoteBodySchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    const message = first ? `${first.path.join('.')}: ${first.message}` : parsed.error.message;
    return res.status(400).json({ error: message });
  }
  const clientId = typeof req.params.clientId === 'string' ? req.params.clientId : req.params.clientId?.[0] ?? '';
  const authorId = req.authorId!;
  const note = await noteService.addNote(clientId, authorId, parsed.data.content);
  res.status(201).json(note);
});
