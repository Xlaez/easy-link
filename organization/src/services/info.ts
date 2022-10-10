import { cloudinaryService } from '@/libs';
import info, { IInfo } from '@/schema/info';
import { LeanDocument, Types } from 'mongoose';

class InfoService {
  private schema: typeof info = info;
  constructor() {}

  public CreateInfo = async (data: {
    content?: string;
    title?: string;
    author: string;
    orgId: string;
    fileType?: string;
    fileUrl?: Array<string>;
  }): Promise<
    IInfo & {
      _id: Types.ObjectId;
    }
  > => {
    const info = this.schema.create({ ...data, file: { type: data.fileType, url: data.fileUrl } });
    return info;
  };

  /**title is the name of the search query by info title */
  public GetInfoForOrg = async (
    orgId: string,
    pageNo: number = 1,
    pageSize: number = 20,
    title?: string,
    sortBy: string = 'newest',
  ): Promise<{
    info: LeanDocument<
      IInfo & {
        _id: Types.ObjectId;
      }
    >[];
    count: number;
    noOfPages: number;
  }> => {
    let queryObj: any = { orgId: orgId };
    let sort: { updatedAt: number } | any = { updatedAt: -1 };

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
    } catch (e) {
      throw new Error(e);
    }
  };

  public GetAnInfo = async (
    infoId: string,
    orgId: string,
  ): Promise<
    LeanDocument<
      IInfo & {
        _id: Types.ObjectId;
      }
    >
  > => {
    const info = await this.schema
      .findOne({ $and: [{ _id: infoId }, { orgId }] })
      .select('-orgId')
      .lean();
    return info;
  };

  public UpdateInfo = async (
    infoId: string,
    content: string,
  ): Promise<
    IInfo & {
      _id: Types.ObjectId;
    }
  > => {
    const info = await this.schema.findByIdAndUpdate(infoId, { content }, { upsert: true });
    return info;
  };

  public DeleteInfo = async (infoId: string): Promise<any> => {
    try {
      const info = await this.schema.findById(infoId);
      if (info?.file.url?.length) {
        await cloudinaryService.deleteMultiple(info.file.url);
      }

      await this.schema.deleteOne({ _id: infoId });

      return true;
    } catch (e) {
      return e;
    }
  };

  public AddViews = async (infoId: string, userId: string): Promise<false | any> => {
    try {
      const info = await this.schema.findOne({ _id: infoId, 'views.viewers': { $nin: userId } });
      if (!info) return false;

      const i2 = await this.schema.updateOne({ _id: infoId }, { $inc: { 'views.count': 1 }, $push: { 'views.viewers': userId } });

      return i2;
    } catch (e) {
      throw new Error(e);
    }
  };
}

export default InfoService;
