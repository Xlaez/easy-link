import { cloudinaryService } from '@/libs';
import PostModel, { IPost } from '@/schemas/post';
import UploadModel, { IUpload } from '@/schemas/upload';

class PostService {
  constructor() {}

  public savePost = async (data: IPost, file: null | any): Promise<IPost> => {
    try {
      let upload: IUpload | null = null;

      if (file !== null) {
        const { url } = await cloudinaryService.uploadSingle(file.path);
        upload = await new UploadModel({
          url,
        });
      }

      const post = await PostModel.create({
        ...data,
        files: file ? [upload._id] : [],
      });

      if (file !== null) {
        upload.postId = post._id;

        await upload.save();
      }
      return post;
    } catch (e) {
      throw new Error(e);
    }
  };

  public getPost = async (postId: any): Promise<any> => {
    try {
      const post = await PostModel.findById(postId).populate('files', 'url').populate('sharedPostId');
      if (!post) return null;
      return post;
    } catch (e) {
      throw new Error(e);
    }
  };

  public getPostsPerUser = async (pageId: number = 1, pageSize: number = 20, search: any, sortBy: any = 'newest', userId: any) => {
    let queryObj: any = { userId: userId };
    let sort: any = { createdAt: -1 }; // SortOrder | { $meta: "textScore"; }

    if (search) {
      const searchRegex = new RegExp(search, 'ig');
      //@ts-ignore
      queryObj = { $or: [{ userId: userId, content: searchRegex }] };
    }

    const numToSkip = (pageId - 1) * pageSize;

    if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    try {
      const posts = await PostModel.find(queryObj)
        .populate('files', 'url')
        .populate('sharedPostId')
        .sort(sort)
        .skip(numToSkip)
        .limit(pageSize)
        .lean();

      const count = await PostModel.find({ userId }).countDocuments();

      const noOfPages = Math.ceil(count / pageSize);

      return { posts, count, noOfPages };
    } catch (e) {
      throw new Error(e);
    }
  };

  public getAllPosts = async (pageId: number = 1, pageSize: number = 20, search: any, sortBy: any = 'newest') => {
    let queryObj: any = {};
    let sort: any = { createdAt: -1 }; // SortOrder | { $meta: "textScore"; }

    if (search) {
      const searchRegex = new RegExp(search, 'ig');
      //@ts-ignore
      queryObj = { content: searchRegex };
    }

    const numToSkip = (pageId - 1) * pageSize;

    if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    try {
      const posts = await PostModel.find(queryObj)
        .populate('files', 'url')
        .populate('sharedPostId')
        .sort(sort)
        .skip(numToSkip)
        .limit(pageSize)
        .lean();

      const count = await PostModel.find().countDocuments();

      const noOfPages = Math.ceil(count / pageSize);

      return { posts, count, noOfPages };
    } catch (e) {
      throw new Error(e);
    }
  };

  public updatePost = async (postId: any, body: any): Promise<boolean> => {
    try {
      await PostModel.findByIdAndUpdate(postId, { content: body });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  };

  public deletePost = async (_id: any): Promise<boolean> => {
    try {
      await PostModel.deleteOne({ _id });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  };

  public addReaction = async (_id: any, reaction: string, reactor: string): Promise<any> => {
    try {
      const r = await PostModel.findByIdAndUpdate(_id, { $push: { reaction: { reactor, reaction } }, $inc: { reactionCount: 1 } });
      return r;
    } catch (e) {
      throw new Error(e);
    }
  };

  public removeReaction = async (id: any, reactor: string): Promise<any> => {
    try {
      const r = await PostModel.findByIdAndUpdate(id, { $pull: { reaction: { reactor } }, $inc: { reactionCount: -1 } });
      return r;
    } catch (e) {
      throw new Error(e);
    }
  };

  /**
   * on frontend the content is null would be set to
   * 'username shared a post'
   */

  public sharePost = async (postId: any, userId: string, content: string): Promise<any> => {
    try {
      const p = PostModel.create({
        sharedPostId: postId,
        userId,
        content,
      });

      await PostModel.findByIdAndUpdate(postId, { $push: { sharer: userId }, $inc: { shareCount: 1 } });
      return p;
    } catch (e) {
      throw new Error(e);
    }
  };
}

export default PostService;
