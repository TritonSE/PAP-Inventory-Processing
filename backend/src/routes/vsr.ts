import express from "express";
import * as VSRController from "src/controllers/vsr";
import * as VSRValidator from "src/validators/vsr";

const router = express.Router();

router.post("/", VSRValidator.createVSR, VSRController.createVSR);

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

export default router;
