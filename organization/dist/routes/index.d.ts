import { Routes } from '../interfaces/routes';
declare class IndexRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    constructor();
    private initializeRoutes;
}
export default IndexRoute;
