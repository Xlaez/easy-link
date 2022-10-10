import * as c from 'cloudinary';
declare class CloudServices {
    cloudinary: typeof c.v2;
    constructor();
    uploadSingle(filePath: string): Promise<{
        url: string;
    }>;
    deleteSingle(fileId: string): Promise<void>;
    uploadMultiple(filePaths: Array<string>): Promise<any>;
    deleteMultiple(fieldIds: Array<string>): Promise<boolean>;
}
export default CloudServices;
