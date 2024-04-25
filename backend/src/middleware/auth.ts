import { Request, Response, NextFunction } from "express";
import { decodeAuthToken } from "src/services/auth";
import { AuthError } from "src/errors/auth";
import UserModel, { UserRole } from "src/models/user";

/**
 * Define this custom type for a request to include the "userUid"
 * property, which middleware will set and validate
 */
export interface PAPRequest extends Request {
  userUid?: string;
}

/**
 * A middleware that requires the user to be signed in and have a valid Firebase token
 * in the "Authorization" header
 */
const requireSignedIn = async (req: PAPRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // Token shoud be "Bearer: <token>"
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    return res
      .status(AuthError.TOKEN_NOT_IN_HEADER.status)
      .send(AuthError.TOKEN_NOT_IN_HEADER.displayMessage(true));
  }

  let userInfo;
  try {
    userInfo = await decodeAuthToken(token);
  } catch (e) {
    return res
      .status(AuthError.INVALID_AUTH_TOKEN.status)
      .send(AuthError.INVALID_AUTH_TOKEN.displayMessage(true));
  }

  if (userInfo) {
    req.userUid = userInfo.uid;
    const user = await UserModel.findOne({ uid: userInfo.uid });
    if (!user) {
      return res
        .status(AuthError.USER_NOT_FOUND.status)
        .send(AuthError.USER_NOT_FOUND.displayMessage(true));
    }
    return next();
  }

  return res.status(AuthError.INVALID_AUTH_TOKEN.status).send(AuthError.INVALID_AUTH_TOKEN.message);
};

/**
 * A middleware that requires the user to have either the staff or admin role
 */
const requireStaffOrAdmin = async (req: PAPRequest, res: Response, next: NextFunction) => {
  const { userUid } = req;
  const user = await UserModel.findOne({ uid: userUid });
  if (!user || ![UserRole.STAFF, UserRole.ADMIN].includes(user.role as UserRole)) {
    return res
      .status(AuthError.NOT_STAFF_OR_ADMIN.status)
      .send(AuthError.NOT_STAFF_OR_ADMIN.displayMessage(true));
  }
  return next();
};

/**
 * A middleware that requires the user to have the admin role
 */
const requireAdmin = async (req: PAPRequest, res: Response, next: NextFunction) => {
  const { userUid } = req;
  const user = await UserModel.findOne({ uid: userUid });
  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(AuthError.NOT_ADMIN.status).send(AuthError.NOT_ADMIN.displayMessage(true));
  }

  return next();
};

export { requireSignedIn, requireStaffOrAdmin, requireAdmin };
