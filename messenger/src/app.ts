import express, { Application, json, urlencoded } from 'express';
import morgan from 'morgan';
import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from '@config';
import hpp from 'hpp';
import { logger, stream } from '@utils/logger';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import errorMiddleware from '@middlewares/error';
import { Routes } from '@interfaces/routes';
import connectDb from '@/config/db';

class App {
  public app: Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 8881;

    // Initialize middlewares here
    this.initializeMiddlewares();
    this.initalizeErrorHandling();
    this.initializeRoutes(routes);
    this.initializaDB();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  public initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(json());
    this.app.use(hpp());
    this.app.use(urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializaDB() {
    connectDb()
      .then(result => {
        logger.info('======================');
        logger.info('MongoDB Connected!');
        logger.info('======================');
      })
      .catch(err => {
        logger.error('======================');
        logger.error('Mongo Err: ', err);
        logger.error('======================');
      });
  }

  private initalizeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
