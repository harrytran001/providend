import { pool } from '../lib/db';
import type { Client } from '../types/notes';

export async function listClients(): Promise<Client[]> {
  const res = await pool.query<{ id: string; name: string }>(
    'SELECT id, name FROM clients ORDER BY name'
  );
  return res.rows.map((r) => ({ id: r.id, name: r.name }));
}

export async function findById(id: string): Promise<Client | null> {
  const res = await pool.query<{ id: string; name: string }>(
    'SELECT id, name FROM clients WHERE id = $1',
    [id]
  );
  const r = res.rows[0];
  return r ? { id: r.id, name: r.name } : null;
}
