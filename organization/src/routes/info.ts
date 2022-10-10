import { Router } from 'express';
import { Routes } from '@interfaces/routes';
import { multerSetup } from '@/libs';
import InfoController from '@/controllers/info';

class InfoRouter implements Routes {
  public path = '/info';
  public router = Router();

  public infoController = new InfoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/resource`, multerSetup.multipleUpload, this.infoController.createInfo);
    this.router.get(`${this.path}/resources`, this.infoController.getOrgInfo);
    this.router.get(`${this.path}/resource`, this.infoController.getInfo);
    this.router.patch(`${this.path}/resource`, this.infoController.updateInfo);
    this.router.delete(`${this.path}/resource/:infoId`, this.infoController.deleteInfo);
    this.router.patch(`${this.path}/add-view`, this.infoController.addViews);
  }
}

export default InfoRouter;
