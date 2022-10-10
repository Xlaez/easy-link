"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importStar(require("express"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const _config_1 = require("./config");
const hpp_1 = tslib_1.__importDefault(require("hpp"));
const logger_1 = require("./utils/logger");
const cors_1 = tslib_1.__importDefault(require("cors"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const error_1 = tslib_1.__importDefault(require("./middlewares/error"));
const db_1 = tslib_1.__importDefault(require("./config/db"));
class App {
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.env = _config_1.NODE_ENV || 'development';
        this.port = _config_1.PORT || 8181;
        // Initialize middlewares here
        this.initializeMiddlewares();
        this.initalizeErrorHandling();
        this.initializeRoutes(routes);
        this.initializaDB();
    }
    listen() {
        this.app.listen(this.port, () => {
            logger_1.logger.info(`================================`);
            logger_1.logger.info(`======= ENV: ${this.env} =======`);
            logger_1.logger.info(`🚀 App listening on the port ${this.port}`);
            logger_1.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    initializeMiddlewares() {
        this.app.use((0, morgan_1.default)(_config_1.LOG_FORMAT, { stream: logger_1.stream }));
        this.app.use((0, cors_1.default)({ origin: _config_1.ORIGIN, credentials: _config_1.CREDENTIALS }));
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use((0, express_1.json)());
        this.app.use((0, hpp_1.default)());
        this.app.use((0, express_1.urlencoded)({ extended: true }));
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }
    initializaDB() {
        (0, db_1.default)()
            .then(result => {
            logger_1.logger.info('======================');
            logger_1.logger.info('MongoDB Connected!');
            logger_1.logger.info('======================');
        })
            .catch(err => {
            logger_1.logger.error('======================');
            logger_1.logger.error('Mongo Err: ', err);
            logger_1.logger.error('======================');
        });
    }
    initalizeErrorHandling() {
        this.app.use(error_1.default);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map