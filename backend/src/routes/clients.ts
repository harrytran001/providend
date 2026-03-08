import { Router, Request, Response } from 'express';
import { log } from '../lib/logger';
import * as clientRepository from '../repositories/clientRepository';

export const clientsRouter = Router();

/** List all clients (no auth required for dropdown; real app would scope by user). */
clientsRouter.get('/', async (_req: Request, res: Response) => {
  const clients = await clientRepository.listClients();
  log.debug('List clients', { count: clients.length });
  res.json(clients);
});
