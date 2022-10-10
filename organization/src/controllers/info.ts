import { cloudinaryService } from '@/libs';
import InfoService from '@/services/info';
import getResourceType from '@/utils/getFileType';
import validator from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';

class InfoController {
    constructor() {}
    private service: InfoService = new InfoService();

    public createInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { body, files } = req;

        const validate = validator.Info({ ...body });
        if (validate) return res.status(400).json(validate.msg);

        let data: any = {};
        try {
            if (files?.length && body) {
                //@ts-expect-error
                const filePaths = files.map((file: any) => file.path);
                const fileType = getResourceType(files[0]);

                const fileData = await cloudinaryService.uploadMultiple(filePaths);
                const fileUrls = fileData.map((file: any) => ({ url: file.url }));
                data = { ...body, fileUrls, fileType };
            } else if (files?.length) {
                //@ts-expect-error
                const filePaths = files.map((file: any) => file.path);
                const fileType = getResourceType(files[0]);

                const fileData = await cloudinaryService.uploadMultiple(filePaths);
                const fileUrls = fileData.map((file: any) => ({ url: file.url }));
                data = { fileUrls, fileType };
            } else if (body) {
                data = { ...body };
            } else {
                return res.status(400).json({ status: 'fail', data: 'no body or file' });
            }

            const info = this.service.CreateInfo({
                content: data.content,
                title: data.title,
                author: data.author,
                orgId: data.orgId,
                fileType: data.fileType,
                fileUrl: data.fileUrls,
            });

            if (!info) return res.status(500).json({ status: 'fail' });

            // notify members that an info has been added

            res.status(201).json({ status: 'success', data: info });
        } catch (e) {
            next(e);
        }
    };

    public getOrgInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { orgId, title, pageNo, pageSize, sortBy } = req.query;

        try {
            const r = await this.service.GetInfoForOrg(orgId.toString(), +pageNo, +pageSize, title?.toString(), sortBy?.toString());

            if (!r) return res.status(404).json({ status: 'fail', data: 'resource not found' });

            res.status(200).json({ status: 'success', data: r });
        } catch (e) {
            next(e);
        }
    };

    public getInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { infoId, orgId } = req.query;

        try {
            const info = await this.service.GetAnInfo(String(infoId), String(orgId));
            if (!info) return res.status(404).json({ status: 'fail', data: 'resource not found' });

            res.status(200).json({ status: 'success', data: info });
        } catch (e) {
            next(e);
        }
    };

    public updateInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { infoId, content }: { infoId: string; content: string } = req.body;

        try {
            const info = await this.service.UpdateInfo(infoId, content);
            if (!info) return res.status(500).json({ status: 'fail', data: 'resource not found' });

            res.status(200).json({ status: 'success', data: 'updated' });
            // notify members that an info has been updated
        } catch (e) {
            next(e);
        }
    };

    public deleteInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { infoId } = req.params;

        try {
            const r = await this.service.DeleteInfo(infoId.toString());
            if (!r) return res.status(500).json({ status: 'fail' });

            res.status(200).json({ status: 'success' });
        } catch (e) {
            next(e);
        }
    };

    public addViews = async (req: Request, res: Response, next: NextFunction) => {
        const { infoId, userId } = req.body;

        try {
            const r = await this.service.AddViews(String(infoId), String(userId));
            if (!r) return res.status(400).json({ status: 'fail', data: 'user already viewed' });
            res.status(200).json({ status: 'success' });
        } catch (e) {
            next(e);
        }
    };
}

export default InfoController;
