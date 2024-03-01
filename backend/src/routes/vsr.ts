import express from "express";

import * as VSRController from "src/controllers/vsr";
import * as VSRValidator from "src/validators/vsr";

const router = express.Router();

router.get("/:id", VSRController.getVSR);
router.post("/", VSRValidator.createVSR, VSRController.createVSR);
router.get("/", VSRController.getAllVSRS);

router.patch("/:id/status", VSRValidator.updateStatus, VSRController.updateStatus);

export default router;
