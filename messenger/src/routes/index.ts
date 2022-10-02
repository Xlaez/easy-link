import { Router } from 'express';
import { Routes } from '@interfaces/routes';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(`${this.path}`, this.indexController.index);
  }
}

export default IndexRoute;
