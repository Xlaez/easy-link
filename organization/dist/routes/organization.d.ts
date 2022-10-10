import { Routes2 } from '../interfaces/routes';
import Organization from '../controllers/organization';
declare class OrganizationRouter implements Routes2 {
    path: string;
    router: import("express-serve-static-core").Router;
    organizationController: Organization;
    constructor();
    private initializeRoutes;
}
export default OrganizationRouter;
