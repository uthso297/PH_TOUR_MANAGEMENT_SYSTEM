"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVars.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(err);
    }
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = req.files.map(file => file.path);
        yield Promise.all(imageUrls.map(url => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    let statusCode = 500;
    let message = `Something went wrong!! ${err.message}`;
    // console.log('Error instance of AppError:', err instanceof AppError);
    const errorSources = [];
    if (err.code === 11000) {
        const matchedArray = err.message.match(/"([^"]*)"/);
        statusCode = 400;
        message = `${matchedArray[1]} already exist`;
    }
    else if (err.name === 'ZodError') {
        statusCode = 400;
        message = 'Zod Error';
        err.issues.forEach((issue) => {
            errorSources.push({
                path: issue.path[0],
                message: issue.message
            });
        });
    }
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid MongoDB Object Id';
    }
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(err.errors);
        errors.forEach((errorObject) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }));
        // console.log(errorSources);
        message = "Validation Error Occur";
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === 'development' ? err.stack : null
    });
});
exports.globalErrorHandler = globalErrorHandler;
