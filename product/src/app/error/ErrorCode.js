"use strict";
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["UNKNOWN"] = 0] = "UNKNOWN";
    ErrorCode[ErrorCode["APNG_ACCESS_ERORR"] = 10] = "APNG_ACCESS_ERORR";
    ErrorCode[ErrorCode["APNG_OTHER_ERORR"] = 11] = "APNG_OTHER_ERORR";
    ErrorCode[ErrorCode["APNG_ERORR"] = 12] = "APNG_ERORR";
    ErrorCode[ErrorCode["WEBP_ERROR"] = 20] = "WEBP_ERROR";
    ErrorCode[ErrorCode["CWEBP_ACCESS_ERROR"] = 30] = "CWEBP_ACCESS_ERROR";
    ErrorCode[ErrorCode["CWEBP_OTHER_ERROR"] = 31] = "CWEBP_OTHER_ERROR";
    ErrorCode[ErrorCode["CWEBP_ERROR"] = 32] = "CWEBP_ERROR";
    ErrorCode[ErrorCode["WEBPMUX_ACCESS_ERROR"] = 40] = "WEBPMUX_ACCESS_ERROR";
    ErrorCode[ErrorCode["WEBPMUX_OTHER_ERROR"] = 41] = "WEBPMUX_OTHER_ERROR";
    ErrorCode[ErrorCode["WEBPMUX_ERROR"] = 42] = "WEBPMUX_ERROR";
    ErrorCode[ErrorCode["HTML_ERROR"] = 50] = "HTML_ERROR";
    ErrorCode[ErrorCode["MAKE_TEMPORARY_ERROR"] = 60] = "MAKE_TEMPORARY_ERROR";
    ErrorCode[ErrorCode["TEMPORARY_CLEAN_ERROR"] = 61] = "TEMPORARY_CLEAN_ERROR";
    ErrorCode[ErrorCode["PNG_COMPRESS_ERROR"] = 70] = "PNG_COMPRESS_ERROR";
    ErrorCode[ErrorCode["PNG_COMPRESS_ACCESS_ERROR"] = 71] = "PNG_COMPRESS_ACCESS_ERROR";
    ErrorCode[ErrorCode["PNG_COMPRESS_OTHER_ERROR"] = 72] = "PNG_COMPRESS_OTHER_ERROR";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
