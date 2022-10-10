import organization, { IOrg } from '@/schema/organization';

class OrgService {
  private schema: typeof organization = organization;

  constructor() {}

  public CreateOrg = async ({ name, userId, fileUrl }: { name: string; userId: string; fileUrl?: string }) => {
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

  public GetOrgById = async (id: string) => {
    try {
      const org: IOrg | null = await this.schema.findOne({ _id: id }).lean();
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };

  public UpdateOrg = async (id: string, body: any) => {
    try {
      const org = await this.schema.findByIdAndUpdate({ id, body });
      return org;
    } catch (e) {
      throw new Error(e);
    }
  };
}
export default OrgService;
