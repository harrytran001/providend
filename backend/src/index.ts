import { config } from './config';
import app from './app';
import { log } from './lib/logger';

app.listen(config.port, () => {
  log.info(`Server running at http://localhost:${config.port}`);
});

export default app;
