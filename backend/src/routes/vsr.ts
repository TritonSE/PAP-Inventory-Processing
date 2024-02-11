import express, { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "src/middleware/auth";

const router = express.Router();

router.delete(
  "/api/vsr/:id",
  [verifyAuthToken],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vsrId = req.params.id;
      const uid = req.body.uid;
      console.log(vsrId, uid);
    } catch (e) {
      next();
    }
  },
);

export { router as vsrRouter };
