import info, { IInfo } from '../schema/info';
import { LeanDocument, Types } from 'mongoose';
declare class InfoService {
    private schema;
    constructor();
    CreateInfo: (data: {
        content?: string;
        title?: string;
        author: string;
        orgId: string;
        fileType?: string;
        fileUrl?: Array<string>;
    }) => Promise<IInfo & {
        _id: Types.ObjectId;
    }>;
    /**title is the name of the search query by info title */
    GetInfoForOrg: (orgId: string, pageNo?: number, pageSize?: number, title?: string, sortBy?: string) => Promise<{
        info: LeanDocument<IInfo & {
            _id: Types.ObjectId;
        }>[];
        count: number;
        noOfPages: number;
    }>;
    GetAnInfo: (infoId: string, orgId: string) => Promise<LeanDocument<IInfo & {
        _id: Types.ObjectId;
    }>>;
    UpdateInfo: (infoId: string, content: string) => Promise<IInfo & {
        _id: Types.ObjectId;
    }>;
    DeleteInfo: (infoId: string) => Promise<any>;
    AddViews: (infoId: string, userId: string) => Promise<false | any>;
}
export default InfoService;
