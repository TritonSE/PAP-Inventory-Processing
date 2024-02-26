import express from "express";
import * as VSRController from "src/controllers/vsr";
import * as VSRValidator from "src/validators/vsr";

const router = express.Router();

router.get("/:id", VSRController.getVSR);
router.post("/", VSRValidator.createVSR, VSRController.createVSR);
router.put("/", VSRValidator.updateVSR, VSRController.updateVSR);


export default router;
