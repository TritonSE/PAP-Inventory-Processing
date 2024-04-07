"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
const errors_1 = require("../errors/errors");
const DECODE_ERROR = "Error in decoding the auth token. Make sure the auth token is valid";
const TOKEN_NOT_IN_HEADER = "Token was not found in header. Be sure to use Bearer <Token> syntax";
const INVALID_AUTH_TOKEN = "Token was invalid.";
const USER_NOT_FOUND = "User not found";
const NOT_STAFF_OR_ADMIN = "User must be a staff/admin.";
const NOT_ADMIN = "User must be an admin.";
/**
 * List of authentication-related errors that may be thrown by our backend.
 */
class AuthError extends errors_1.CustomError {
}
exports.AuthError = AuthError;
AuthError.DECODE_ERROR = new AuthError(0, 401, DECODE_ERROR);
AuthError.TOKEN_NOT_IN_HEADER = new AuthError(1, 401, TOKEN_NOT_IN_HEADER);
AuthError.INVALID_AUTH_TOKEN = new AuthError(2, 401, INVALID_AUTH_TOKEN);
AuthError.USER_NOT_FOUND = new AuthError(3, 401, USER_NOT_FOUND);
AuthError.NOT_STAFF_OR_ADMIN = new AuthError(4, 403, NOT_STAFF_OR_ADMIN);
AuthError.NOT_ADMIN = new AuthError(5, 403, NOT_ADMIN);
