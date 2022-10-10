"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const libs_1 = require("../libs");
const organization_1 = tslib_1.__importDefault(require("../controllers/organization"));
class OrganizationRouter {
    constructor() {
        this.path = '/org';
        this.router = (0, express_1.Router)();
        this.organizationController = new organization_1.default();
        this.initializeRoutes();
        // this.organizationController = new Organization();
    }
    initializeRoutes() {
        this.router.post('/new', libs_1.multerSetup.singleUpload, this.organizationController.createOrg);
        this.router.get('/by-name', this.organizationController.getOrgByName);
        this.router.get('/by-id', this.organizationController.getOrgById);
        this.router.patch('/update', this.organizationController.updateOrg);
        this.router.delete('/remove/:id', this.organizationController.deleteOrg);
        this.router.put('/members', this.organizationController.addMembers);
        this.router.put('/executives', this.organizationController.addExecutives);
        this.router.purge('/members', this.organizationController.removeMembers);
        this.router.purge('/executives', this.organizationController.removeExecutives);
        this.router.get('/user-in', this.organizationController.getOrgUserIsIn);
        this.router.patch('/update-logo', libs_1.multerSetup.singleUpload, this.organizationController.updateOrgLogo);
    }
}
exports.default = OrganizationRouter;
//# sourceMappingURL=organization.js.map