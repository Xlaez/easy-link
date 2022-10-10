"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    title: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
        minLength: [10, 'an organization info cannot be less than 10 characters'],
    },
    views: {
        count: {
            type: Number,
            default: 0,
        },
        viewers: [
            {
                type: String,
            },
        ],
    },
    author: {
        type: String,
        required: true,
    },
    orgId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Org',
    },
    file: {
        url: [
            {
                type: String,
                required: false,
            },
        ],
        type: {
            type: String,
            required: false,
        },
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('OrgInfo', schema);
//# sourceMappingURL=info.js.map