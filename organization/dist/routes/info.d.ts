import { Routes } from '../interfaces/routes';
import InfoController from '../controllers/info';
declare class InfoRouter implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    infoController: InfoController;
    constructor();
    private initializeRoutes;
}
export default InfoRouter;
