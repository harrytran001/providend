import { Router, Request, Response } from 'express';
import { log } from '../lib/logger';
import { getHealth } from '../services/healthService';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response) => {
  const result = await getHealth();
  if (result.status === 'ok') {
    log.info('GET /api/health', { status: result.status });
  } else {
    log.warn('GET /api/health degraded', { services: result.services });
  }
  res.status(result.status === 'ok' ? 200 : 503).json(result);
});
