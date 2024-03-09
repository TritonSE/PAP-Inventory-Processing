import express from "express";

import { verifyAuthToken } from "src/middleware/auth";
import * as UserController from "src/controllers/user";

const router = express.Router();

router.get("/whoami", [verifyAuthToken], UserController.getWhoAmI);

export default router;
