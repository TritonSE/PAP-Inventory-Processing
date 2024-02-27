import express from "express";
import * as FurnitureItemController from "src/controllers/furnitureItem";
// import * as VSRValidator from "src/validators/furnitureItem";

const router = express.Router();

/**
 * TaskValidator.createTask serves as middleware for this route. This means
 * that instead of immediately serving up the route when the request is made,
 * Express firsts passes the request to TaskValidator.createTask.
 * TaskValidator.createTask processes the request and determines whether the
 * request should be sent through or an error should be thrown.
 */
router.get("/", FurnitureItemController.getFurnitureItems);
// router.post("/", VSRValidator.createVSR, VSRController.createVSR);

export default router;
