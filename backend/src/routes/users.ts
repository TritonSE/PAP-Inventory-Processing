import express, { NextFunction, Request, Response } from "express";
import { ServiceError } from "src/errors/service";
import { User } from "src/models/users";
import { verifyAuthToken } from "src/middleware/auth";

const router = express.Router();

router.get(
  "/api/whoami",
  [verifyAuthToken],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.body.uid;
      const user = await User.findOne({ uid: uid });
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
  },
);

export { router as userRouter };
