"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const organization_1 = tslib_1.__importDefault(require("../schema/organization"));
class OrgService {
    constructor() {
        this.schema = organization_1.default;
        this.CreateOrg = async ({ name, userId, fileUrl, }) => {
            try {
                const org = await this.schema.create({
                    name,
                    executives: [userId],
                    members: [userId],
                    logo: fileUrl,
                });
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.GetOrgByName = async (name) => {
            try {
                const org = await this.schema.findOne({ name: name });
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.GetOrgById = async (id) => {
            try {
                const org = await this.schema.findOne({ _id: id }).lean();
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.UpdateOrg = async (id, body) => {
            try {
                const org = await this.schema.findByIdAndUpdate(id, body);
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.DeleteOrg = async (id) => {
            try {
                const org = await this.schema.findByIdAndDelete(id);
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.Addmembers = async (members, id) => {
            try {
                const org = await this.schema.findByIdAndUpdate(id, { $push: { members: { $each: members } } });
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.Removemembers = async (members, id) => {
            try {
                const org = await this.schema.findByIdAndUpdate(id, { $pull: { members: { $in: members } } });
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.AddExecutives = async (members, id) => {
            try {
                const org = await this.schema.findByIdAndUpdate(id, { $push: { executives: { $each: members } } });
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
        this.GetAllUserOrg = async (userId, pageNo = 1, pageSize = 5) => {
            const org = await this.schema
                .find({ members: { $in: userId } })
                .skip((pageNo - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const count = await this.schema.find({ members: { $in: userId } }).countDocuments();
            const noOfPages = Math.ceil(count / pageSize);
            return { org, count, noOfPages };
        };
        this.UpdateLogo = async (orgId, url) => {
            let org = await this.schema.findById(orgId);
            if (!org)
                return null;
            org.logo = url;
            org = await org.save();
            return org;
        };
        this.RemoveExecutives = async (members, id) => {
            try {
                const org = await this.schema.findByIdAndUpdate(id, { $pull: { executives: { $in: members } } });
                return org;
            }
            catch (e) {
                throw new Error(e);
            }
        };
    }
}
exports.default = OrgService;
//# sourceMappingURL=organization.js.map