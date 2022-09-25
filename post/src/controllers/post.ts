import { postService } from '@/services';
import { NextFunction, Request, Response } from 'express';

class PostController {
  constructor() {}

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    const { body, file } = req;

    try {
      const response = await postService.savePost(body, file ? file : null);

      if (!response) return res.status(500).send('Internal server error');

      res.status(201).json({ status: 'success', data: response });
    } catch (e) {
      next(e);
    }
  };

  public getPost = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.query;

    try {
      const response = await postService.getPost(postId);

      if (!response) return res.status(404).json({ status: 'fail', data: [] });

      res.status(200).json({ status: 'success', data: response });
    } catch (e) {
      next(e);
    }
  };

  public getPostsPerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { pageId, pageSize, userId, search, sortBy } = req.query;

    const id = +pageId;
    const size = +pageSize;

    try {
      const response = await postService.getPostsPerUser(id, size, search, sortBy, userId);

      if (!response) return res.status(404).json({ status: 'fail', data: [] });

      res.status(200).json({ status: 'success', data: response });
    } catch (e) {
      next(e);
    }
  };

  public getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { pageId, pageSize, search, sortBy } = req.query;

    const id = +pageId;
    const size = +pageSize;

    try {
      const response = await postService.getAllPosts(id, size, search, sortBy);

      if (!response) return res.status(404).json({ status: 'fail', data: [] });

      res.status(200).json({ status: 'success', data: response });
    } catch (e) {
      next(e);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const { postId, content } = req.body;

    if (!postId) return res.status(400).json({ status: 'fail', data: 'provide postId' });

    try {
      const r = await postService.updatePost(postId, content);
      if (!r) return res.status(500).json({ status: 'fail', data: 'internal server error' });

      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    try {
      const r = await postService.deletePost(postId);

      if (!r) return res.status(500).json({ status: 'fail', data: 'internal server error' });
      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };
}

export default PostController;
