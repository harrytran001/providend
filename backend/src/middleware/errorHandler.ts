import { Request, Response, NextFunction } from 'express';
import { log } from '../lib/logger';

/**
 * Catch unhandled errors and send a safe JSON response.
 * Use next(err) in routes/services to hit this.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const message = err instanceof Error ? err.message : 'Internal server error';
  const status = (err as { status?: number }).status ?? 500;
  log.error(message, { status, stack: err instanceof Error ? err.stack : undefined });
  res.status(status).json({ error: message });
}
