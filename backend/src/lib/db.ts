import { Pool } from 'pg';
import { config } from '../config';

/**
 * Raw Postgres pool. Use repositories for data access (queries, inserts, etc.).
 */
export const pool = new Pool(config.db);
