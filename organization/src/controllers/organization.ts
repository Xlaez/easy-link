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

  public updateOrg = async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const r = await this.service.UpdateOrg(body.id, body);
      if (!r) return res.status(500).json({ status: 'fail' });

      /**send a notification to users */
      res.status(200).json({ status: 'success', data: 'updated' });
    } catch (e) {
      next(e);
    }
  };

  public addMembers = async (req: Request, res: Response, next: NextFunction) => {
    const { members, id } = req.body;
    try {
      const r = await this.service.Addmembers(members, id);

      if (!r) return res.status(500).json({ status: 'fail' });

      /**send a notification to users */

      res.status(200).json({ status: 'success', data: 'updated' });
    } catch (e) {
      next(e);
    }
  };

  public removeMembers = async (req: Request, res: Response, next: NextFunction) => {
    const { members, id } = req.body;
    try {
      const r = await this.service.Removemembers(members, id);

      if (!r) return res.status(500).json({ status: 'fail' });

      /**send a notification to users */
      res.status(200).json({ status: 'success', data: 'updated' });
    } catch (e) {
      next(e);
    }
  };

  public deleteOrg = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const r = await this.service.DeleteOrg(id);

      if (!r) return res.status(500).json({ status: 'fail' });

      res.status(200).json({ status: 'success', data: 'deleted' });
    } catch (e) {
      next(e);
    }
  };

  public addExecutives = async (req: Request, res: Response, next: NextFunction) => {
    const { members, id } = req.body;
    try {
      const r = await this.service.AddExecutives(members, id);

      if (!r) return res.status(500).json({ status: 'fail' });

      /**send a notification to users */
      res.status(200).json({ status: 'success', data: 'updated' });
    } catch (e) {
      next(e);
    }
  };

  public removeExecutives = async (req: Request, res: Response, next: NextFunction) => {
    const { members, id } = req.body;
    try {
      const r = await this.service.RemoveExecutives(members, id);

      if (!r) return res.status(500).json({ status: 'fail' });

      /**send a notification to users */
      res.status(200).json({ status: 'success', data: 'updated' });
    } catch (e) {
      next(e);
    }
  };

  public getOrgUserIsIn = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, pageSize, pageNo } = req.query;

    try {
      const orgs = await this.service.GetAllUserOrg(String(userId), +pageNo, +pageSize);

      if (!orgs) return res.status(404).json({ status: 'fail', data: 'resource not found' });

      res.status(200).json({ status: 'success', data: orgs });
    } catch (e) {
      next(e);
    }
  };

  public updateOrgLogo = async (req: Request, res: Response, next: NextFunction) => {
    const { orgId } = req.body;
    const { file } = req;

    try {
      if (!file) return res.status(400).json({ status: 'fail', data: 'provide a file' });
      const { url } = await cloudinaryService.uploadSingle(file.path);

      const r = await this.service.UpdateLogo(orgId, url);

      if (!r) return res.status(500).json({ status: 'fail' });

      res.status(200).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  };
}

export default Organization;
