import express from "express";

import { requireAdmin, requireSignedIn } from "src/middleware/auth";
import * as UserController from "src/controllers/user";
import * as UserValidator from "src/validators/user";

const router = express.Router();

router.get("/whoami", requireSignedIn, UserController.getWhoAmI);
router.get("/", requireSignedIn, requireAdmin, UserController.getUsers);
router.post(
  "/",
  requireSignedIn,
  requireAdmin,
  UserValidator.createUser,
  UserController.createUser,
);
router.patch(
  "/:uid/password",
  requireSignedIn,
  requireAdmin,
  UserValidator.changeUserPassword,
  UserController.changeUserPassword,
);
router.delete("/:uid", requireSignedIn, requireAdmin, UserController.deleteUser);

export default router;
