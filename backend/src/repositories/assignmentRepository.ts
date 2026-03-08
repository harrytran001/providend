import { pool } from '../lib/db';

/**
 * Check if user is assigned to client (authorization).
 * Real auth would validate token and load permissions from DB/cache.
 */
export async function isAssigned(clientId: string, userId: string): Promise<boolean> {
  const res = await pool.query<{ count: string }>(
    'SELECT 1 FROM client_assignments WHERE client_id = $1 AND user_id = $2',
    [clientId, userId]
  );
  return res.rows.length > 0;
}
