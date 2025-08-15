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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = __importDefault(require("./app/utils/seedSuperAdmin"));
const redis_config_1 = require("./app/config/redis.config");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log('Connected to mongodb😍');
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is listening on port ${env_1.envVars.PORT} 😊`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
// iife function
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield startServer();
    yield (0, seedSuperAdmin_1.default)();
}))();
// 1
process.on("unhandledRejection", (err) => {
    console.log("Unhandeled rejection detected....server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// 1 example
// Promise.reject(new Error("I forgot to catch this promise"))
// 2
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected....server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// 2
// throw new Error("I forgot to handle this local error")
// 3
process.on("SIGTERM", (err) => {
    console.log("SIGNAL TERMINATION detected....server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// 4 (SIGIN)
process.on("SIGINT", () => {
    console.log("SIGINT detected....server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
/*

1.unhandeled rejection error
2.uncaught rejection error
3.signal termination system

*/
