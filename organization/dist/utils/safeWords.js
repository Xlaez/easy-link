"use strict";
// export const FU = /fuck/gi;
// export const PU = /pussy/gi;
// export const BI = /bitch/gi;
// export const BA = /bastard/gi;
// export const MF = /motherfucker/gi;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterBannedWords = void 0;
/**
 * Words to be filtered for if safeWords setting is activated for a chatroom
 * Update the list as application grows
 */
const filterArr = [/fuck/gi, /pussy/gi, /bitch/gi, /bastard/gi, /motherfucker/gi];
class FilterBannedWords {
    constructor() {
        this.safeWordsRes = 'safewords enabled, your message has a banned word';
        /**Prefer to use if statement over loop */
        this.filter = (message) => {
            for (let i = 0; i < filterArr.length; i++) {
                if (message.match(filterArr[i]))
                    return this.safeWordsRes;
            }
        };
    }
    constrcutor() { }
}
exports.FilterBannedWords = FilterBannedWords;
//# sourceMappingURL=safeWords.js.map