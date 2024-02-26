import express from "express";
import * as VSRController from "src/controllers/vsr";
import * as VSRValidator from "src/validators/vsr";

const router = express.Router();

router.post("/", VSRValidator.createVSR, VSRController.createVSR);

export default router;
