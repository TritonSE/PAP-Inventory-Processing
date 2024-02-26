import { RequestHandler } from "express";
import { ServiceError } from "src/errors/service";
import UserModel from "src/models/user";

export const getWhoAmI: RequestHandler = async (req, res, next) => {
  try {
    const uid = req.body.uid;
    const user = await UserModel.findOne({ uid: uid });
    if (!user) {
      throw ServiceError.USER_NOT_FOUND;
    }
    const { _id: mongoId, role } = user;
    res.status(200).send({
      message: "Current user information",
      user: {
        mongoId,
        uid,
        role,
      },
    });
    return;
  } catch (e) {
    next();
    console.log(e);
    return res.status(400).json({
      error: e,
    });
  }
};
