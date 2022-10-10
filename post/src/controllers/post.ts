import { postService } from '@/services';
import amqp from 'amqplib/callback_api';
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

  public addReaction = async (req: Request, res: Response, next: NextFunction) => {
    const { reaction, reactor, postId } = req.body;

    const enumA = ['clap', 'wow', 'love'];

    if (!enumA.includes(reaction)) {
      return res.status(400).json({ status: 'fail', data: 'invalid reaction type' });
    }

    try {
      const r = await postService.addReaction(postId, reaction, reactor);

      if (!r) return res.status(500).json({ status: 'fail', data: 'could not add reaction' });

      res.status(200).json({ status: 'success', data: 'reaction added' });
    } catch (e) {
      next(e);
    }
  };

  public removeReaction = async (req: Request, res: Response, next: NextFunction) => {
    const { reactor, postId } = req.body;
    try {
      const r = await postService.removeReaction(postId, reactor);

      if (!r) return res.status(500).json({ status: 'fail', data: 'could not add reaction' });

      res.status(200).json({ status: 'success', data: 'reaction removed' });
    } catch (e) {
      next(e);
    }
  };

  public sharePost = async (req: Request, res: Response, next: NextFunction) => {
    const { postId, content, userId } = req.body;

    try {
      const r = await postService.sharePost(postId, userId, content);

      if (!r) return res.status(500).json({ status: 'fail', data: 'unable to share' });

      res.status(200).json({ status: 'success', data: 'post shared' });
    } catch (e) {
      next(e);
    }
  };

  public getPostsForUserFeed = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    // get from amqp
    amqp.connect('amqp://guest:password@localhost:5672', async function (error, connection) {
      if (error) {
        throw error;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = 'get-connections';

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.consume(
          'get-connections',
          function (msg) {
            const m = msg.content.toString();
          },
          {
            noAck: true,
          },
        );
      });
    });
  };
}

export default PostController;
