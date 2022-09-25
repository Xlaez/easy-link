import { commentService } from '@/services';
import { NextFunction, Request, Response } from 'express';

class CommentController {
  constructor() {}

  public createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const r = await commentService.createComment({ ...body });

      if (!r) return res.status(500).json({ status: 'fail', data: 'could not create comment/reply' });

      res.status(201).json({ status: 'success', data: r });
    } catch (e) {
      res.status(500).send(e);
    }
  };

  public getCommentsPerPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageId, sortBy, numPerPost, postId } = req.query;

      const r = await commentService.getCommentsPerPost(+numPerPost, sortBy, +pageId, postId);

      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

  public getComment = async (req: Request, res: Response, next: NextFunction) => {
    let { commentId } = req.query;
    try {
      const id = commentId.toString();
      const comment = await commentService.getComment(id);

      if (!comment) return res.status(404).json({ status: 'fail', data: 'resource not found' });

      res.status(200).json({ status: 'success', data: comment });
    } catch (e) {
      next(e);
    }
  };

  public updateComment = async (req: Request, res: Response, next: NextFunction) => {
    let { body } = req;

    try {
      const r = await commentService.updateComment(body);

      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };
}

export default CommentController;
