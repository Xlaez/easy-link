import App from '@/app';
import validateEnv from '@/utils/validateEnv';
import OrganizationRouter from '@/routes/organization';

validateEnv();

const app = new App([new OrganizationRouter()]);
app.listen();
