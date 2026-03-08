import { z } from 'zod';

/** Request body for POST /clients/:clientId/notes */
export const addNoteBodySchema = z.object({
  content: z.string().min(1, 'content is required').max(10_000, 'content too long'),
});

export type AddNoteBody = z.infer<typeof addNoteBodySchema>;
