"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const libs_1 = require("../libs");
const info_1 = tslib_1.__importDefault(require("../services/info"));
const getFileType_1 = tslib_1.__importDefault(require("../utils/getFileType"));
class InfoController {
    constructor() {
        this.service = new info_1.default();
        this.createInfo = async (req, res, next) => {
            const { body, files } = req;
            let data = {};
            try {
                if ((files === null || files === void 0 ? void 0 : files.length) && body) {
                    //@ts-expect-error
                    const filePaths = files.map((file) => file.path);
                    const fileType = (0, getFileType_1.default)(files[0]);
                    const fileData = await libs_1.cloudinaryService.uploadMultiple(filePaths);
                    const fileUrls = fileData.map((file) => ({ url: file.url }));
                    data = Object.assign(Object.assign({}, body), { fileUrls, fileType });
                }
                else if (files === null || files === void 0 ? void 0 : files.length) {
                    //@ts-expect-error
                    const filePaths = files.map((file) => file.path);
                    const fileType = (0, getFileType_1.default)(files[0]);
                    const fileData = await libs_1.cloudinaryService.uploadMultiple(filePaths);
                    const fileUrls = fileData.map((file) => ({ url: file.url }));
                    data = { fileUrls, fileType };
                }
                else if (body) {
                    data = Object.assign({}, body);
                }
                else {
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
                if (!info)
                    return res.status(500).json({ status: 'fail' });
                // notify members that an info has been added
                res.status(201).json({ status: 'success', data: info });
            }
            catch (e) {
                next(e);
            }
        };
        this.getOrgInfo = async (req, res, next) => {
            const { orgId, title, pageNo, pageSize, sortBy } = req.query;
            try {
                const r = await this.service.GetInfoForOrg(orgId.toString(), +pageNo, +pageSize, title === null || title === void 0 ? void 0 : title.toString(), sortBy === null || sortBy === void 0 ? void 0 : sortBy.toString());
                if (!r)
                    return res.status(404).json({ status: 'fail', data: 'resource not found' });
                res.status(200).json({ status: 'success', data: r });
            }
            catch (e) {
                next(e);
            }
        };
        this.getInfo = async (req, res, next) => {
            const { infoId, orgId } = req.query;
            try {
                const info = await this.service.GetAnInfo(String(infoId), String(orgId));
                if (!info)
                    return res.status(404).json({ status: 'fail', data: 'resource not found' });
                res.status(200).json({ status: 'success', data: info });
            }
            catch (e) {
                next(e);
            }
        };
        this.updateInfo = async (req, res, next) => {
            const { infoId, content } = req.body;
            try {
                const info = await this.service.UpdateInfo(infoId, content);
                if (!info)
                    return res.status(500).json({ status: 'fail', data: 'resource not found' });
                res.status(200).json({ status: 'success', data: 'updated' });
                // notify members that an info has been updated
            }
            catch (e) {
                next(e);
            }
        };
        this.deleteInfo = async (req, res, next) => {
            const { infoId } = req.params;
            try {
                const r = await this.service.DeleteInfo(infoId.toString());
                if (!r)
                    return res.status(500).json({ status: 'fail' });
                res.status(200).json({ status: 'success' });
            }
            catch (e) {
                next(e);
            }
        };
        this.addViews = async (req, res, next) => {
            const { infoId, userId } = req.body;
            try {
                const r = await this.service.AddViews(String(infoId), String(userId));
                if (!r)
                    return res.status(400).json({ status: 'fail', data: 'user already viewed' });
                res.status(200).json({ status: 'success' });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.default = InfoController;
//# sourceMappingURL=info.js.map