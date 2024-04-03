"use strict";
/**
 * Defines server and middleware.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_errors_1 = require("http-errors");
const vsr_1 = __importDefault(require("./routes/vsr"));
const furnitureItem_1 = __importDefault(require("./routes/furnitureItem"));
const user_1 = __importDefault(require("./routes/user"));
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const app = (0, express_1.default)();
// initializes Express to accept JSON in the request/response body
app.use(express_1.default.json());
// sets the "Access-Control-Allow-Origin" header on all responses to allow
// requests from the frontend, which has a different origin - see the following
// pages for more info:
// https://expressjs.com/en/resources/middleware/cors.html
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
app.use((0, cors_1.default)({
    origin: validateEnv_1.default.FRONTEND_ORIGIN,
}));
// Put routes here (e.g. app.use("/api/example", exampleRoutes); )
app.use("/api/user", user_1.default);
app.use("/api/vsr", vsr_1.default);
app.use("/api/furnitureItems", furnitureItem_1.default);
/**
 * Error handler; all errors thrown by server are handled here.
 * Explicit typings required here because TypeScript cannot infer the argument types.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((error, req, res, next) => {
    // 500 is the "internal server error" error code, this will be our fallback
    let statusCode = 500;
    let errorMessage = "An error has occurred.";
    // check is necessary because anything can be thrown, type is not guaranteed
    if ((0, http_errors_1.isHttpError)(error)) {
        // error.status is unique to the http error class, it allows us to pass status codes with errors
        statusCode = error.status;
        errorMessage = error.message;
    }
    // prefer custom http errors but if they don't exist, fallback to default
    else if (error instanceof Error) {
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;
