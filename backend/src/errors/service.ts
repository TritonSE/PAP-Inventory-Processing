import { CustomError } from "src/errors/errors";

const INVALID_MONGO_ID = "User ID is not a valid MONGO ID";

const USER_NOT_FOUND = "User not found in mongo database";

export class ServiceError extends CustomError {
  static INVALID_MONGO_ID = new ServiceError(0, 401, INVALID_MONGO_ID);

  static USER_NOT_FOUND = new ServiceError(1, 401, USER_NOT_FOUND);
}
