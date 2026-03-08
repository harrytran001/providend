import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import { helloRouter } from './routes/hello';

const app = express();

app.use(cors({ origin: config.frontendOrigin }));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/hello', helloRouter);

app.use(errorHandler);

export default app;
