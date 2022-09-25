import { Router } from 'express';
import { Routes } from '@interfaces/routes';
import CommentController from '@/controllers/comment';

class CommentRouter implements Routes {
  public path = '/comment';
  public router = Router();
  public commentcontroller = new CommentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.commentcontroller.createComment);
    this.router.get(`${this.path}`, this.commentcontroller.getCommentsPerPost);
    this.router.get(`${this.path}/one`, this.commentcontroller.getComment);
    this.router.patch(`${this.path}`, this.commentcontroller.updateComment);
  }
}

export default CommentRouter;
