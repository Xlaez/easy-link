import App from '@/app';
import validateEnv from '@/utils/validateEnv';
import MsgRouter from '@/routes/message';

validateEnv();

const app = new App([new MsgRouter()]);
app.listen();
