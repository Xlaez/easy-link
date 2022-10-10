import { NextFunction, Request, Response } from 'express';
declare class InfoController {
    constructor();
    private service;
    createInfo: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    getOrgInfo: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    getInfo: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    updateInfo: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    deleteInfo: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    addViews: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
}
export default InfoController;
