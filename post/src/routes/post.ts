import { Router } from 'express';
import { Routes } from '@interfaces/routes';
import { multerSetup } from '@/libs';
import PostController from '@/controllers/post';

class PostRouter implements Routes {
  public path = '/post';
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, multerSetup.singleUpload, this.postController.createPost);
    this.router.get(`${this.path}`, this.postController.getPost);
    this.router.get(`${this.path}/users`, this.postController.getPostsPerUser);
    this.router.get(`${this.path}/all`, this.postController.getAllPosts);
    this.router.patch(`${this.path}/one`, this.postController.updatePost);
    this.router.delete(`${this.path}/:postId`, this.postController.deletePost);
  }
}

export default PostRouter;
