import comment from '@/schemas/comment';
import PostModel from '@/schemas/post';

class CommentService {
  constructor() {}

  public createComment = async (body: any): Promise<boolean> => {
    let { postId, content, authorId, parentId } = body;

    try {
      let newComment = new comment({
        authorId: authorId,
        content: content,
        postId: postId,
      });

      if (parentId) {
        const parentComment = await PostModel.findOne({
          _id: postId,
          comments: parentId,
        });

        if (!parentComment) throw new Error('parentId supplied but reply not found');

        newComment.parentId = parentId;
        await comment.findByIdAndUpdate(parentId, {
          $inc: { repliesCount: 1 },
          $push: { replies: newComment._id },
        });
      }

      newComment = await newComment.save();

      await PostModel.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

      return true;
    } catch (e) {
      throw new Error(e);
    }
  };

  public getCommentsPerPost = async (numPerPost: number = 25, sortBy: any = 'newest', pageId: number = 1, postId: any): Promise<any> => {
    let sort: any = { createdAt: -1 };

    if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    try {
      const comments = await comment
        .find({ postId })
        .skip((+pageId - 1) * numPerPost)
        .limit(numPerPost)
        .sort(sort)
        .lean();

      const count = await comment.find({ postId }).countDocuments();

      return { comments, count };
    } catch (e) {
      throw new Error(e);
    }
  };

  public getComment = async (commentId: string): Promise<any> => {
    try {
      const c = await comment.findById(commentId).populate('replies', '_id content parentId authorId repliesCount createdAt updatedAt').lean();
      return c;
    } catch (e) {
      throw new Error(e);
    }
  };

  public updateComment = async (body: any): Promise<boolean> => {
    try {
      const { commentId, content } = body;

      await comment.findByIdAndUpdate(commentId, { content });

      return true;
    } catch (e) {
      throw new Error(e);
    }
  };

  public deleteComment = async (commentId: string): Promise<boolean | string> => {
    try {
      const c = await comment.findById(commentId);
      if (!c) return 'not found';

      //@ts-expect-error
      const { parentId, postId } = comment;

      const p = await PostModel.findById(postId);

      if (!p) return 'not found';
      const { comments } = p;

      if (comments.length === 0) {
        return 'no comments';
      }

      if (parentId) {
        await comment.findByIdAndUpdate(parentId, { $pull: { replies: c._id }, $inc: { repliesCount: -1 } });
      }
      await PostModel.findByIdAndUpdate({ _id: postId }, { $pull: { comments: commentId } });
      await comment.deleteOne({ _id: commentId });

      return true;
    } catch (e) {
      throw new Error(e);
    }
  };
}

export default CommentService;
