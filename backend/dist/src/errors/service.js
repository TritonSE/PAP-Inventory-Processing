"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = void 0;
const errors_1 = require("../errors/errors");
const INVALID_MONGO_ID = "User ID is not a valid MONGO ID";
const USER_NOT_FOUND = "User not found in mongo database";
/**
 * List of errors that can be thrown by our backend services.
 */
class ServiceError extends errors_1.CustomError {
}
exports.ServiceError = ServiceError;
ServiceError.INVALID_MONGO_ID = new ServiceError(0, 401, INVALID_MONGO_ID);
ServiceError.USER_NOT_FOUND = new ServiceError(1, 401, USER_NOT_FOUND);
