"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = require("../config");
const c = tslib_1.__importStar(require("cloudinary"));
class CloudServices {
    constructor() {
        this.cloudinary = c.v2;
        this.cloudinary.config({
            cloud_name: config_1.CLOUDINARY_NAME,
            api_key: config_1.CLOUDINARY_API_KEY,
            api_secret: config_1.CLOUDINARY_SECRET,
        });
    }
    async uploadSingle(filePath) {
        const { secure_url } = await this.cloudinary.uploader.upload(filePath);
        const url = secure_url;
        return { url };
    }
    async deleteSingle(fileId) {
        return await this.cloudinary.uploader.destroy(fileId);
    }
    async uploadMultiple(filePaths) {
        const result = await Promise.all(filePaths.map(filePath => this.uploadSingle(filePath)));
        if (!result)
            return fail;
        return result;
    }
    async deleteMultiple(fieldIds) {
        await Promise.all(fieldIds.map(fieldId => this.deleteSingle(fieldId)));
        return true;
    }
}
exports.default = CloudServices;
//# sourceMappingURL=cloudinary.js.map