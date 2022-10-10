import { Router } from 'express';
import { Routes2 } from '@interfaces/routes';
import { multerSetup } from '@/libs';
import Organization from '@/controllers/organization';

class OrganizationRouter implements Routes2 {
  public path = '/org';
  public router = Router();

  public organizationController = new Organization();

  constructor() {
    this.initializeRoutes();
    // this.organizationController = new Organization();
  }

  private initializeRoutes() {
    this.router.post('/new', multerSetup.singleUpload, this.organizationController.createOrg);
    this.router.get('/by-name', this.organizationController.getOrgByName);
    this.router.get('/by-id', this.organizationController.getOrgById);
  }
}

export default OrganizationRouter;
