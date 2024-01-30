import express, { NextFunction, Request, Response } from "express";
import { decodeAuthToken } from "src/services/auth";
import { AuthError } from "src/errors/auth";
import { ServiceError } from "src/errors/service";
import mongoose from "mongoose";
import { User } from "src/models/users";

const router = express.Router();

router.get("/api/whoami/:jwttoken", async (req: Request, res: Response, next: NextFunction) => {
  console.log("inside get route");
  try {
    const JWTToken = req.params.jwttoken;
    const userInfo = await decodeAuthToken(JWTToken);
    if (userInfo) {
      const uid = userInfo.uid;
      if (!mongoose.Types.ObjectId.isValid(uid)) {
        throw ServiceError.INVALID_MONGO_ID;
      }
      const user = await User.findById(uid);
      if (!user) {
        throw ServiceError.USER_NOT_FOUND;
      }
      const { role } = user;
      res.status(200).send({
        message: "Current user information",
        user: {
          uid,
          role,
        },
      });
      return;
    }
    throw AuthError.DECODE_ERROR;
  } catch (e) {
    next();
    console.log(e);
    return res.status(400).json({
      error: e,
    });
  }
});
