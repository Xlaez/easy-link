/// <reference types="qs" />
/// <reference types="express" />
declare class MulterSetUp {
    constructor();
    private fileTypes;
    private fileStorage;
    private fileFilter;
    singleUpload: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    multipleUpload: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export default MulterSetUp;
