"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const multer_1 = tslib_1.__importStar(require("multer"));
const path_1 = tslib_1.__importDefault(require("path"));
class MulterSetUp {
    constructor() {
        this.fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/pdf', 'audio/mpeg', 'audio/mp3', 'audio/m4a'];
        this.fileStorage = (0, multer_1.diskStorage)({
            destination: (request, file, callback) => {
                let dir;
                const audio = ['audio/mpeg', 'audio/mp3', 'audio/m4a'];
                const image = ['image/jpeg', 'image/jpg', 'image/png', 'image/pdf', 'image/gif'];
                if (audio.includes(file.mimetype)) {
                    dir = path_1.default.resolve(process.cwd(), 'assets', 'audio');
                    callback(null, dir);
                }
                else if (image.includes(file.mimetype)) {
                    dir = path_1.default.resolve(process.cwd(), 'assets', 'images');
                    callback(null, dir);
                }
                else {
                    throw new Error('File not permitted');
                }
                // setting destination
                // will be removed and left blank when production ready
            },
            filename: (request, file, callback) => {
                callback(null, `connect-organization-${Date.now().toString()}-${file.originalname}`);
            },
        });
        this.fileFilter = (request, file, callback) => {
            if (this.fileTypes.includes(file.mimetype)) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        };
        this.singleUpload = (0, multer_1.default)({
            storage: this.fileStorage,
            fileFilter: this.fileFilter,
        }).single('upload');
        this.multipleUpload = (0, multer_1.default)({
            storage: this.fileStorage,
            fileFilter: this.fileFilter,
        }).array('uploads');
    }
}
exports.default = MulterSetUp;
//# sourceMappingURL=multer.js.map