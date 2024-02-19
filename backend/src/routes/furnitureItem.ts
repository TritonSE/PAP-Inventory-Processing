import express from "express";
import * as FurnitureItemValidator from "src/validators/furnitureItem";
import * as FurnitureItemControllers from "src/controllers/furnitureItem";

const router = express.Router();

/**
 * TaskValidator.createTask serves as middleware for this route. This means
 * that instead of immediately serving up the route when the request is made,
 * Express firsts passes the request to TaskValidator.createTask.
 * TaskValidator.createTask processes the request and determines whether the
 * request should be sent through or an error should be thrown.
 */
router.post(
  "/",
  FurnitureItemValidator.createFurnitureItem,
  FurnitureItemControllers.createFurnitureItem,
);

export default router;
