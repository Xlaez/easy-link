import { IOrg } from '../schema/organization';
import { LeanDocument, Types } from 'mongoose';
declare class OrgService {
    private schema;
    constructor();
    CreateOrg: ({ name, userId, fileUrl, }: {
        name: string;
        userId: string;
        fileUrl?: string;
    }) => Promise<IOrg & {
        _id: Types.ObjectId;
    }>;
    GetOrgByName: (name: string) => Promise<IOrg>;
    GetOrgById: (id: string) => Promise<IOrg>;
    UpdateOrg: (id: string, body: any) => Promise<IOrg & {
        _id: Types.ObjectId;
    }>;
    DeleteOrg: (id: string) => Promise<IOrg & {
        _id: Types.ObjectId;
    }>;
    Addmembers: (members: any, id: string) => Promise<IOrg & {
        _id: Types.ObjectId;
    }>;
    Removemembers: (members: any, id: string) => Promise<IOrg & {
        _id: Types.ObjectId;
    }>;
    AddExecutives: (members: any, id: string) => Promise<IOrg & {
        _id: Types.ObjectId;
    }>;
    GetAllUserOrg: (userId: any, pageNo?: number, pageSize?: number) => Promise<{
        org: LeanDocument<IOrg & {
            _id: Types.ObjectId;
        }>[];
        count: number;
        noOfPages: number;
    }>;
    UpdateLogo: (orgId: string, url: string) => Promise<IOrg & {
        _id: Types.ObjectId;
    }>;
    RemoveExecutives: (members: any, id: string) => Promise<IOrg & {
        _id: Types.ObjectId;
    }>;
}
export default OrgService;
