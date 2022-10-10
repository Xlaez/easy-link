export declare class FilterBannedWords {
    constrcutor(): void;
    private safeWordsRes;
    /**Prefer to use if statement over loop */
    filter: (message: string) => string | null;
}
