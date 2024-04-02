import { RequestHandler } from "express";
import { PAPRequest } from "src/middleware/auth";
import UserModel from "src/models/user";

export const getWhoAmI: RequestHandler = async (req: PAPRequest, res, next) => {
  try {
    const { userUid } = req;
    const user = await UserModel.findOne({ uid: userUid });
    const { _id, uid, role } = user!;
    res.status(200).send({
      _id,
      uid,
      role,
    });
  } catch (error) {
    next(error);
  }
};