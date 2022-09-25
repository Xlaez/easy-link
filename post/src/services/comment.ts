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

  public getCommentsPerPost = async (numPerPost: number = 25, sortBy: any = 'newest', pageId: number = 1, postId: any) => {
    let sort: any = { createdAt: -1 };

    if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    try {
      const comments = await comment
        .find({ postId })
        .populate('replies', 'createdAt content _id authorId')
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
}

export default CommentService;
