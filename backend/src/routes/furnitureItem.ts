import express from "express";
import { requireAdmin, requireSignedIn, requireStaffOrAdmin } from "src/middleware/auth";
import * as FurnitureItemController from "src/controllers/furnitureItem";
import * as FurnitureItemValidator from "src/validators/furnitureItem";

const router = express.Router();

router.get("/", FurnitureItemController.getFurnitureItems);
router.post("/", FurnitureItemValidator.createFurnitureItem, FurnitureItemController.createFurnitureItem);
router.delete("/:id", requireSignedIn, requireStaffOrAdmin, FurnitureItemController.deleteFurnitureItem);


export default router;
