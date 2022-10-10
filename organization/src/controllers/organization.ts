import { cloudinaryService } from '@/libs';
import OrgService from '@/services/organization';
import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

class Organization {
  constructor() {}

  private service: OrgService = new OrgService();

  public createOrg = async (req: Request, res: Response, next: NextFunction) => {
    const { body, file }: { body: { name: string; userId: string }; file?: Express.Multer.File } = req;

    let data = body;
    try {
      const isOrg = await this.service.GetOrgByName(body.name);
      if (isOrg) return res.status(400).json({ status: 'fail', data: 'name is taken already' });

      if (file) {
        const { url } = await cloudinaryService.uploadSingle(file.path);
        const data2 = data;
        Object.assign(data2, data, { fileUrl: url });
        data = data2;
        console.info(data);
      } else {
        data = data;
      }

      const r = await this.service.CreateOrg({ ...data });
      if (!r) return res.status(500).json({ status: 'fail', data: 'internal server error' });
      res.status(201).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

  public getOrgByName = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.query;

    try {
      const org = await this.service.GetOrgByName(String(name));
      if (!org) return res.status(404).json({ status: 'fail', data: 'resource not found' });

      res.status(200).json({ status: 'success', data: org });
    } catch (e) {
      next(e);
    }
  };

  public getOrgById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    try {
      const org = await this.service.GetOrgById(id.toString());
      if (!org) return res.status(404).json({ status: 'fail', data: 'resource not found' });

      res.status(200).json({ status: 'success', data: org });
    } catch (e) {
      next(e);
    }
  };
}

export default Organization;
