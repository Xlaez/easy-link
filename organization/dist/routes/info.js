"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const libs_1 = require("../libs");
const info_1 = tslib_1.__importDefault(require("../controllers/info"));
class InfoRouter {
    constructor() {
        this.path = '/info';
        this.router = (0, express_1.Router)();
        this.infoController = new info_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/resource`, libs_1.multerSetup.multipleUpload, this.infoController.createInfo);
        this.router.get(`${this.path}/resources`, this.infoController.getOrgInfo);
        this.router.get(`${this.path}/resource`, this.infoController.getInfo);
        this.router.patch(`${this.path}/resource`, this.infoController.updateInfo);
        this.router.delete(`${this.path}/resource/:infoId`, this.infoController.deleteInfo);
        this.router.patch(`${this.path}/add-view`, this.infoController.addViews);
    }
}
exports.default = InfoRouter;
//# sourceMappingURL=info.js.map