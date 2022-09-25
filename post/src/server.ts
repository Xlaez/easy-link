import App from '@/app';
import validateEnv from '@/utils/validateEnv';
import PostRouter from '@/routes/post';
import CommentRouter from './routes/comment';

validateEnv();

const app = new App([new PostRouter(), new CommentRouter()]);
app.listen();
