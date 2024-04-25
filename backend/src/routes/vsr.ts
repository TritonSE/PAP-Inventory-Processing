import express from "express";

import * as VSRController from "src/controllers/vsr";
import { requireAdmin, requireSignedIn, requireStaffOrAdmin } from "src/middleware/auth";
import * as VSRValidator from "src/validators/vsr";

const router = express.Router();

router.get("/", requireSignedIn, requireStaffOrAdmin, VSRController.getAllVSRS);
router.get("/:search", VSRController.getAllVSRSBySearch);
router.post("/", VSRValidator.createVSR, VSRController.createVSR);
router.get("/:id", requireSignedIn, requireStaffOrAdmin, VSRController.getVSR);
router.delete("/:id", requireSignedIn, requireAdmin, VSRController.deleteVSR);
router.patch(
  "/:id/status",
  requireSignedIn,
  requireStaffOrAdmin,
  VSRValidator.updateStatus,
  VSRController.updateStatus,
);
router.put(
  "/:id",
  requireSignedIn,
  requireStaffOrAdmin,
  VSRValidator.updateVSR,
  VSRController.updateVSR,
);

export default router;
