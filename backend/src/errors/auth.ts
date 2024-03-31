import { CustomError } from "src/errors/errors";

const DECODE_ERROR = "Error in decoding the auth token. Make sure the auth token is valid";
const TOKEN_NOT_IN_HEADER = "Token was not found in header. Be sure to use Bearer <Token> syntax";
const INVALID_AUTH_TOKEN = "Token was invalid.";
const USER_NOT_FOUND = "User not found";
const NOT_STAFF_OR_ADMIN = "User must be a staff/admin.";
const NOT_ADMIN = "User must be an admin.";

export class AuthError extends CustomError {
  static DECODE_ERROR = new AuthError(0, 401, DECODE_ERROR);
  static TOKEN_NOT_IN_HEADER = new AuthError(1, 401, TOKEN_NOT_IN_HEADER);
  static INVALID_AUTH_TOKEN = new AuthError(2, 401, INVALID_AUTH_TOKEN);
  static USER_NOT_FOUND = new AuthError(3, 401, USER_NOT_FOUND);
  static NOT_STAFF_OR_ADMIN = new AuthError(4, 403, NOT_STAFF_OR_ADMIN);
  static NOT_ADMIN = new AuthError(5, 403, NOT_ADMIN);
}
