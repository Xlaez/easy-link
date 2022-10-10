import App from '@/app';
import validateEnv from '@/utils/validateEnv';
import OrganizationRouter from '@/routes/organization';
import InfoRouter from '@/routes/info';

validateEnv();

const app = new App([new OrganizationRouter(), new InfoRouter()]);
app.listen();
