import { Request, Response, NextFunction } from "express";
import { decodeAuthToken } from "src/services/auth";
import { AuthError } from "src/errors/auth";

const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log("verify being called");
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.split(" ")[0] === "Bearer" ? authHeader.split(" ")[1] : null;
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
    req.body.uid = userInfo.uid;
    // req.body.role = userInfo.role;
    return next();
  }

  return res.status(AuthError.INVALID_AUTH_TOKEN.status).send(AuthError.INVALID_AUTH_TOKEN.message);
};

export { verifyAuthToken };
