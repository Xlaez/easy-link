"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const libs_1 = require("../libs");
const organization_1 = tslib_1.__importDefault(require("../services/organization"));
class Organization {
    constructor() {
        this.service = new organization_1.default();
        this.createOrg = async (req, res, next) => {
            const { body, file } = req;
            let data = body;
            try {
                const isOrg = await this.service.GetOrgByName(body.name);
                if (isOrg)
                    return res.status(400).json({ status: 'fail', data: 'name is taken already' });
                if (file) {
                    const { url } = await libs_1.cloudinaryService.uploadSingle(file.path);
                    const data2 = data;
                    Object.assign(data2, data, { fileUrl: url });
                    data = data2;
                    console.info(data);
                }
                else {
                    data = data;
                }
                const r = await this.service.CreateOrg(Object.assign({}, data));
                if (!r)
                    return res.status(500).json({ status: 'fail', data: 'internal server error' });
                res.status(201).json({ status: 'success', data: r });
            }
            catch (e) {
                next(e);
            }
        };
        this.getOrgByName = async (req, res, next) => {
            const { name } = req.query;
            try {
                const org = await this.service.GetOrgByName(String(name));
                if (!org)
                    return res.status(404).json({ status: 'fail', data: 'resource not found' });
                res.status(200).json({ status: 'success', data: org });
            }
            catch (e) {
                next(e);
            }
        };
        this.getOrgById = async (req, res, next) => {
            const { id } = req.query;
            try {
                const org = await this.service.GetOrgById(id.toString());
                if (!org)
                    return res.status(404).json({ status: 'fail', data: 'resource not found' });
                res.status(200).json({ status: 'success', data: org });
            }
            catch (e) {
                next(e);
            }
        };
        this.updateOrg = async (req, res, next) => {
            const { body } = req;
            try {
                const r = await this.service.UpdateOrg(body.id, body);
                if (!r)
                    return res.status(500).json({ status: 'fail' });
                /**send a notification to users */
                res.status(200).json({ status: 'success', data: 'updated' });
            }
            catch (e) {
                next(e);
            }
        };
        this.addMembers = async (req, res, next) => {
            const { members, id } = req.body;
            try {
                const r = await this.service.Addmembers(members, id);
                if (!r)
                    return res.status(500).json({ status: 'fail' });
                /**send a notification to users */
                res.status(200).json({ status: 'success', data: 'updated' });
            }
            catch (e) {
                next(e);
            }
        };
        this.removeMembers = async (req, res, next) => {
            const { members, id } = req.body;
            try {
                const r = await this.service.Removemembers(members, id);
                if (!r)
                    return res.status(500).json({ status: 'fail' });
                /**send a notification to users */
                res.status(200).json({ status: 'success', data: 'updated' });
            }
            catch (e) {
                next(e);
            }
        };
        this.deleteOrg = async (req, res, next) => {
            const { id } = req.params;
            try {
                const r = await this.service.DeleteOrg(id);
                if (!r)
                    return res.status(500).json({ status: 'fail' });
                res.status(200).json({ status: 'success', data: 'deleted' });
            }
            catch (e) {
                next(e);
            }
        };
        this.addExecutives = async (req, res, next) => {
            const { members, id } = req.body;
            try {
                const r = await this.service.AddExecutives(members, id);
                if (!r)
                    return res.status(500).json({ status: 'fail' });
                /**send a notification to users */
                res.status(200).json({ status: 'success', data: 'updated' });
            }
            catch (e) {
                next(e);
            }
        };
        this.removeExecutives = async (req, res, next) => {
            const { members, id } = req.body;
            try {
                const r = await this.service.RemoveExecutives(members, id);
                if (!r)
                    return res.status(500).json({ status: 'fail' });
                /**send a notification to users */
                res.status(200).json({ status: 'success', data: 'updated' });
            }
            catch (e) {
                next(e);
            }
        };
        this.getOrgUserIsIn = async (req, res, next) => {
            const { userId, pageSize, pageNo } = req.query;
            try {
                const orgs = await this.service.GetAllUserOrg(String(userId), +pageNo, +pageSize);
                if (!orgs)
                    return res.status(404).json({ status: 'fail', data: 'resource not found' });
                res.status(200).json({ status: 'success', data: orgs });
            }
            catch (e) {
                next(e);
            }
        };
        this.updateOrgLogo = async (req, res, next) => {
            const { orgId } = req.body;
            const { file } = req;
            try {
                if (!file)
                    return res.status(400).json({ status: 'fail', data: 'provide a file' });
                const { url } = await libs_1.cloudinaryService.uploadSingle(file.path);
                const r = await this.service.UpdateLogo(orgId, url);
                if (!r)
                    return res.status(500).json({ status: 'fail' });
                res.status(200).json({ status: 'success' });
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.default = Organization;
//# sourceMappingURL=organization.js.map