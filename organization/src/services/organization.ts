import organization, { IOrg } from '@/schema/organization';
import { LeanDocument, Types } from 'mongoose';

class OrgService {
  private schema: typeof organization = organization;

  constructor() {}

  public CreateOrg = async ({
    name,
    userId,
    fileUrl,
  }: {
    name: string;
    userId: string;
    fileUrl?: string;
  }): Promise<
    IOrg & {
      _id: Types.ObjectId;
    }
  > => {
    try {
      const org = await this.schema.create({
        name,
        executives: [userId],
        members: [userId],
        logo: fileUrl,
      });
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };
  public GetOrgByName = async (name: string) => {
    try {
      const org: IOrg | null = await this.schema.findOne({ name: name });
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };

  public GetOrgById = async (id: string): Promise<IOrg> => {
    try {
      const org: IOrg | null = await this.schema.findOne({ _id: id }).lean();
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };

  public UpdateOrg = async (
    id: string,
    body: any,
  ): Promise<
    IOrg & {
      _id: Types.ObjectId;
    }
  > => {
    try {
      const org = await this.schema.findByIdAndUpdate(id, body);
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };

  public DeleteOrg = async (
    id: string,
  ): Promise<
    IOrg & {
      _id: Types.ObjectId;
    }
  > => {
    try {
      const org = await this.schema.findByIdAndDelete(id);
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };

  public Addmembers = async (
    members: any,
    id: string,
  ): Promise<
    IOrg & {
      _id: Types.ObjectId;
    }
  > => {
    try {
      const org = await this.schema.findByIdAndUpdate(id, { $push: { members: { $each: members } } });
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };

  public Removemembers = async (
    members: any,
    id: string,
  ): Promise<
    IOrg & {
      _id: Types.ObjectId;
    }
  > => {
    try {
      const org = await this.schema.findByIdAndUpdate(id, { $pull: { members: { $in: members } } });
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };

  public AddExecutives = async (
    members: any,
    id: string,
  ): Promise<
    IOrg & {
      _id: Types.ObjectId;
    }
  > => {
    try {
      const org = await this.schema.findByIdAndUpdate(id, { $push: { executives: { $each: members } } });
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };

  public GetAllUserOrg = async (
    userId: any,
    pageNo: number = 1,
    pageSize: number = 5,
  ): Promise<{
    org: LeanDocument<
      IOrg & {
        _id: Types.ObjectId;
      }
    >[];
    count: number;
    noOfPages: number;
  }> => {
    const org = await this.schema
      .find({ members: { $in: userId } })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const count = await this.schema.find({ members: { $in: userId } }).countDocuments();
    const noOfPages = Math.ceil(count / pageSize);
    return { org, count, noOfPages };
  };

  public UpdateLogo = async (orgId: string, url: string) => {
    let org = await this.schema.findById(orgId);

    if (!org) return null;
    org.logo = url;

    org = await org.save();
    return org;
  };

  public RemoveExecutives = async (
    members: any,
    id: string,
  ): Promise<
    IOrg & {
      _id: Types.ObjectId;
    }
  > => {
    try {
      const org = await this.schema.findByIdAndUpdate(id, { $pull: { executives: { $in: members } } });
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };
}
export default OrgService;
