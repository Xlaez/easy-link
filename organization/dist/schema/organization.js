"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['free', 'paid'],
        default: 'free',
    },
    executives: [
        {
            type: String,
        },
    ],
    members: [
        {
            type: String,
        },
    ],
    logo: {
        type: String,
        required: false,
    },
});
exports.default = (0, mongoose_1.model)('Org', schema);
//# sourceMappingURL=organization.js.map