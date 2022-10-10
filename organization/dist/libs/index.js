"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerSetup = exports.cloudinaryService = void 0;
const tslib_1 = require("tslib");
const cloudinary_1 = tslib_1.__importDefault(require("./cloudinary"));
const multer_1 = tslib_1.__importDefault(require("./multer"));
const cloudinaryService = new cloudinary_1.default();
exports.cloudinaryService = cloudinaryService;
const multerSetup = new multer_1.default();
exports.multerSetup = multerSetup;
//# sourceMappingURL=index.js.map