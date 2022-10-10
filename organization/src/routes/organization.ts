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
    this.router.patch('/update', this.organizationController.updateOrg);
    this.router.delete('/remove/:id', this.organizationController.deleteOrg);
    this.router.put('/members', this.organizationController.addMembers);
    this.router.put('/executives', this.organizationController.addExecutives);
    this.router.purge('/members', this.organizationController.removeMembers);
    this.router.purge('/executives', this.organizationController.removeExecutives);
    this.router.get('/user-in', this.organizationController.getOrgUserIsIn);
    this.router.patch('/update-logo', multerSetup.singleUpload, this.organizationController.updateOrgLogo);
  }
}

export default OrganizationRouter;
