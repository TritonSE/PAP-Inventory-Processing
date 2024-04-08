import express from "express";

import { requireSignedIn, requireAdmin } from "src/middleware/auth";
import * as UserController from "src/controllers/user";

const router = express.Router();

router.get("/whoami", requireSignedIn, UserController.getWhoAmI);
router.get("/", requireSignedIn, requireAdmin, UserController.getUsers);

export default router;
