import express from "express";
import * as FurnitureItemController from "src/controllers/furnitureItem";

const router = express.Router();

router.get("/", FurnitureItemController.getFurnitureItems);

export default router;
