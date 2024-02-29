import express from "express";
import * as VSRController from "src/controllers/vsr";
import { verifyAuthToken } from "src/middleware/auth";
import * as VSRValidator from "src/validators/vsr";

const router = express.Router();

router.get("/", VSRController.getAllVSRS);
router.get("/:id", VSRController.getVSR);
router.post("/", VSRValidator.createVSR, VSRController.createVSR);
router.delete("/:id", [verifyAuthToken], VSRController.deleteVSR);

export default router;
