import { pool } from '../lib/db';
import type { Note } from '../types/notes';

export async function findByClientId(clientId: string): Promise<Note[]> {
  const res = await pool.query<{
    id: string;
    client_id: string;
    author_id: string;
    content: string;
    created_at: Date;
  }>(
    `SELECT id, client_id, author_id, content, created_at
     FROM notes WHERE client_id = $1 ORDER BY created_at DESC`,
    [clientId]
  );
  return res.rows.map((r) => ({
    id: r.id,
    clientId: r.client_id,
    authorId: r.author_id,
    content: r.content,
    createdAt: r.created_at.toISOString(),
  }));
}

export async function create(
  clientId: string,
  authorId: string,
  content: string
): Promise<Note> {
  const res = await pool.query<{
    id: string;
    client_id: string;
    author_id: string;
    content: string;
    created_at: Date;
  }>(
    `INSERT INTO notes (client_id, author_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, client_id, author_id, content, created_at`,
    [clientId, authorId, content]
  );
  const r = res.rows[0];
  return {
    id: r.id,
    clientId: r.client_id,
    authorId: r.author_id,
    content: r.content,
    createdAt: r.created_at.toISOString(),
  };
}
