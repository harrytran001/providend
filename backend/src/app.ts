import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { mockAuth } from './middleware/mockAuth';
import { clientsRouter } from './routes/clients';
import { healthRouter } from './routes/health';
import { helloRouter } from './routes/hello';
import { notesRouter } from './routes/notes';

const app = express();

app.use(cors({ origin: config.frontendOrigin }));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/hello', helloRouter);
app.use('/api/clients', clientsRouter); // list clients (no auth for dropdown)
app.use('/api', mockAuth, notesRouter);  // notes routes use mock auth + assignment check

app.use(errorHandler);

export default app;
