import express from "express";

import { requireSignedIn } from "src/middleware/auth";
import * as UserController from "src/controllers/user";

const router = express.Router();

router.get("/whoami", requireSignedIn, UserController.getWhoAmI);

export default router;
