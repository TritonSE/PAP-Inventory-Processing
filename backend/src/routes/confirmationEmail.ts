import express from "express";
import { requireAdmin, requireSignedIn } from "src/middleware/auth";
import * as ConfirmationEmailController from "src/controllers/confirmationEmail";
import * as ConfirmationEmailValidator from "src/validators/confirmationEmail";

const router = express.Router();

router.get("/", requireSignedIn, requireAdmin, ConfirmationEmailController.getConfirmationEmail);
router.put(
  "/",
  requireSignedIn,
  requireAdmin,
  ConfirmationEmailValidator.updateConfirmationEmail,
  ConfirmationEmailController.updateConfirmationEmail,
);

export default router;
