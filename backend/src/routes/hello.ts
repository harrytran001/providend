import { Router, Request, Response } from 'express';
import { log } from '../lib/logger';

export const helloRouter = Router();

/**
 * Sample endpoint for BE ↔ FE verification.
 * GET /api/hello returns a greeting and server time.
 */
helloRouter.get('/', (_req: Request, res: Response) => {
  log.info('GET /api/hello');
  res.json({
    message: 'Hello from Providend API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});
