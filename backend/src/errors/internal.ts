import { CustomError } from "./errors";

const NO_SERVICE_ACCOUNT_KEY = "Could not find service account key env variable";

export class InternalError extends CustomError {
  static NO_SERVICE_ACCOUNT_KEY = new InternalError(0, 500, NO_SERVICE_ACCOUNT_KEY);
}
