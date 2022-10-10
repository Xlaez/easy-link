"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
const path = tslib_1.__importStar(require("path"));
(0, dotenv_1.config)({ path: path.resolve(process.cwd(), '.env') });
const MONGO_URL = process.env.DATABASE_URL;
const connectDb = () => (0, mongoose_1.connect)(MONGO_URL, {
    appName: 'connect',
});
exports.default = connectDb;
//# sourceMappingURL=db.js.map