import { CustomError } from "src/errors/errors";

const DECODE_ERROR = "Error in decoding the auth token. Make sure the auth token is valid";

export class AuthError extends CustomError {
  static DECODE_ERROR = new AuthError(0, 401, DECODE_ERROR);
}
