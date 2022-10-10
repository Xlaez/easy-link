import { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from '@/config';
import * as c from 'cloudinary';

class CloudServices {
  cloudinary: typeof c.v2;

  constructor() {
    this.cloudinary = c.v2;

    this.cloudinary.config({
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_SECRET,
    });
  }

  public async uploadSingle(filePath: string) {
    const { secure_url } = await this.cloudinary.uploader.upload(filePath);
    const url = secure_url;

    return { url };
  }

  public async deleteSingle(fileId: string): Promise<void> {
    return await this.cloudinary.uploader.destroy(fileId);
  }

  public async uploadMultiple(filePaths: Array<string>): Promise<any> {
    const result = await Promise.all(filePaths.map(filePath => this.uploadSingle(filePath)));

    if (!result) return fail;
    return result;
  }

  public async deleteMultiple(fieldIds: Array<string>): Promise<boolean> {
    await Promise.all(fieldIds.map(fieldId => this.deleteSingle(fieldId)));
    return true;
  }
}

export default CloudServices;
