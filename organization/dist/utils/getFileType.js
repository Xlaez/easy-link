"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
let resourceType;
const imageFormats = ['.jpeg', '.png', '.jpg'];
const audioFormats = ['.mp3', '.mp4', '.mpeg'];
const videoFormats = ['.mp4', '.mov', '.webm', '.wmv', '.mkv', '.flv', '.mpeg'];
const docFormats = ['.doc', '.docx', '.docm', '.pdf', '.txt', '.csv', '.ppt', '.pptx', '.pptm', '.xls', '.xlsm', 'xlsx', '.html'];
const getResourceType = (file) => {
    if (imageFormats.includes(path.extname(file.originalname))) {
        resourceType = 'image';
    }
    else if (audioFormats.includes(path.extname(file.originalname))) {
        resourceType = 'audio';
    }
    else if (videoFormats.includes(path.extname(file.originalname))) {
        resourceType = 'video';
    }
    else if (docFormats.includes(path.extname(file.originalname))) {
        resourceType = 'document';
    }
    resourceType = false;
    return resourceType;
};
exports.default = getResourceType;
//# sourceMappingURL=getFileType.js.map