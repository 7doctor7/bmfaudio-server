import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import l from './logger';

import installValidator from './openapi';

const app = express();
const exit = process.exit;

export default class ExpressServer {
  private routes: (app: Application) => void;

  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '500kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '500kb',
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '1000000kb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    app.use(cors({origin: '*'}));
  }

  router(routes: (app: Application) => void): ExpressServer {
    this.routes = routes;
    return this;
  }

  listen(port: number): Application {
    const networkInterfaces = os.networkInterfaces();
    console.log('networkInterfaces => ', networkInterfaces);
    const welcome = (p: number) => (): void =>
      l.info(
        `Server up and running in ${
          process.env.NODE_ENV || 'development'
        } mode | @HOST: ${os.hostname()} on port: ${p}}`
      );

    installValidator(app, this.routes)
      .then(() => {
        http.createServer(app).listen(port, welcome(port));
      })
      .catch((e) => {
        l.error(e);
        exit(1);
      });

    return app;
  }
}
