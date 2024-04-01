"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
const errors_1 = require("../errors/errors");
const NO_SERVICE_ACCOUNT_KEY = "Could not find service account key env variable";
class InternalError extends errors_1.CustomError {
}
exports.InternalError = InternalError;
InternalError.NO_SERVICE_ACCOUNT_KEY = new InternalError(0, 500, NO_SERVICE_ACCOUNT_KEY);
