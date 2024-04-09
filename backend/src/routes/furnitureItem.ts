import express from "express";
import * as FurnitureItemController from "src/controllers/furnitureItem";
import * as FurnitureItemValidator from "src/validators/furnitureItem";

const router = express.Router();

router.get("/", FurnitureItemController.getFurnitureItems);
router.post("/", FurnitureItemValidator.createFurnitureItem, FurnitureItemController.createFurnitureItem);

export default router;
