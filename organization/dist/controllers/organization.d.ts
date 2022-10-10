import { NextFunction, Request, Response } from 'express';
declare class Organization {
    constructor();
    private service;
    createOrg: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    getOrgByName: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    getOrgById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    updateOrg: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    addMembers: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    removeMembers: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    deleteOrg: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    addExecutives: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    removeExecutives: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    getOrgUserIsIn: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
    updateOrgLogo: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
}
export default Organization;
