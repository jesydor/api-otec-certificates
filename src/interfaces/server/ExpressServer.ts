import express, { Application, Router } from 'express';
import actuator from 'express-actuator';
import path from 'path';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import { loggerPino } from '../../../resources/loggerPino';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const exit = process.exit;

const corsOptionsDelegate = (_ :any, callback :any) => {
  const corsOptions = { origin: true };
  callback(null, corsOptions);
};

export default class ExpressServer {
  private routes!: (app: Application) => void;
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(cors(corsOptionsDelegate));
    app.use(express.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      express.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(express.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(actuator());
    app.use(express.static(`${root}/public`));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
  }

  router(routes: (app: Application) => void): ExpressServer {
    this.routes = routes;
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
    loggerPino.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`);

    this.routes(app); 
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}
