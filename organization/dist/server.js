"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("./app"));
const validateEnv_1 = tslib_1.__importDefault(require("./utils/validateEnv"));
const organization_1 = tslib_1.__importDefault(require("./routes/organization"));
const info_1 = tslib_1.__importDefault(require("./routes/info"));
(0, validateEnv_1.default)();
const app = new app_1.default([new organization_1.default(), new info_1.default()]);
app.listen();
//# sourceMappingURL=server.js.map