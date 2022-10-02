import CloudServices from './cloudinary';
import MulterSetUp from './multer';

const cloudinaryService = new CloudServices();
const multerSetup = new MulterSetUp();

export { cloudinaryService, multerSetup };
