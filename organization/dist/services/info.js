"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const libs_1 = require("../libs");
const info_1 = tslib_1.__importDefault(require("../schema/info"));
class InfoService {
    constructor() {
        this.schema = info_1.default;
        this.CreateInfo = async (data) => {
            const info = this.schema.create(Object.assign(Object.assign({}, data), { file: { type: data.fileType, url: data.fileUrl } }));
            return info;
        };
        /**title is the name of the search query by info title */
        this.GetInfoForOrg = async (orgId, pageNo = 1, pageSize = 20, title, sortBy = 'newest') => {
            let queryObj = { orgId: orgId };
            let sort = { updatedAt: -1 };
            if (title) {
                queryObj = { $and: [{ orgId, title: { $regex: title, $options: 'i' } }] };
            }
            const numberToSkip = (pageNo - 1) * pageSize;
            if (sortBy === 'oldest') {
                sort = { updatedAt: 1 };
            }
            try {
                const info = await this.schema.find(queryObj).sort(sort).skip(numberToSkip).limit(pageSize).lean();
                const count = await this.schema.find(queryObj).countDocuments();
                const noOfPages = Math.ceil(count / pageSize);
                return { info, count, noOfPages };
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.GetAnInfo = async (infoId, orgId) => {
            const info = await this.schema
                .findOne({ $and: [{ _id: infoId }, { orgId }] })
                .select('-orgId')
                .lean();
            return info;
        };
        this.UpdateInfo = async (infoId, content) => {
            const info = await this.schema.findByIdAndUpdate(infoId, { content }, { upsert: true });
            return info;
        };
        this.DeleteInfo = async (infoId) => {
            var _a;
            try {
                const info = await this.schema.findById(infoId);
                if ((_a = info === null || info === void 0 ? void 0 : info.file.url) === null || _a === void 0 ? void 0 : _a.length) {
                    await libs_1.cloudinaryService.deleteMultiple(info.file.url);
                }
                await this.schema.deleteOne({ _id: infoId });
                return true;
            }
            catch (e) {
                return e;
            }
        };
        this.AddViews = async (infoId, userId) => {
            try {
                const info = await this.schema.findOne({ _id: infoId, 'views.viewers': { $nin: userId } });
                if (!info)
                    return false;
                const i2 = await this.schema.updateOne({ _id: infoId }, { $inc: { 'views.count': 1 }, $push: { 'views.viewers': userId } });
                return i2;
            }
            catch (e) {
                throw new Error(e);
            }
        };
    }
}
exports.default = InfoService;
//# sourceMappingURL=info.js.map