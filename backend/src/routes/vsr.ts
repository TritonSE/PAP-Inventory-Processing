import express, { Request, Response, NextFunction } from "express";
import { AuthError } from "src/errors/auth";
import { ServiceError } from "src/errors/service";
import { verifyAuthToken } from "src/middleware/auth";
import { User } from "src/models/user";
import VSRModel from "src/models/vsr";

const router = express.Router();

router.delete(
  "/api/vsr/:id",
  [verifyAuthToken],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = req.body.uid;
      const user = await User.findOne({ uid: uid });
      if (!user) {
        throw ServiceError.USER_NOT_FOUND;
      }

      const { role } = user;
      if (role != "admin") {
        throw AuthError.NOT_ADMIN;
      }

      const vsrId = req.params.id;
      await VSRModel.findByIdAndDelete(vsrId);
      return res.status(200).json({
        message: `successfully deleted vsr ${vsrId}`,
      });
    } catch (e) {
      next();
    }
  },
);

export { router as vsrRouter };
