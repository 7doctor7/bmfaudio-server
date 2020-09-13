import { Application } from 'express';

import examplesRouter from './api/controllers/examples/router';
import recordsRouter from './api/controllers/bmf-records/router';

const API_V1 = '/api/v1';

export default function routes(app: Application): void {
  app.use(`${API_V1}/examples`, examplesRouter);
  app.use(`${API_V1}/records`, recordsRouter);
}
