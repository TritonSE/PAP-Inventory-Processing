import { CustomError } from "src/errors/errors";

const NO_SERVICE_ACCOUNT_KEY = "Could not find service account key env variable";

/**
 * List of internal errors that can be thrown by our backend if something goes wrong.
 */
export class InternalError extends CustomError {
  static NO_SERVICE_ACCOUNT_KEY = new InternalError(0, 500, NO_SERVICE_ACCOUNT_KEY);
}
