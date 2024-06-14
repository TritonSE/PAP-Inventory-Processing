import express from "express";
import { requireSignedIn, requireAdmin } from "src/middleware/auth";
import * as FurnitureItemController from "src/controllers/furnitureItem";
import * as FurnitureItemValidator from "src/validators/furnitureItem";

const router = express.Router();

router.get("/", FurnitureItemController.getFurnitureItems);
router.post(
  "/",
  requireSignedIn,
  requireAdmin,
  FurnitureItemValidator.createFurnitureItem,
  FurnitureItemController.createFurnitureItem,
);
router.delete("/:id", requireSignedIn, requireAdmin, FurnitureItemController.deleteFurnitureItem);
router.put(
  "/:id",
  requireSignedIn,
  requireAdmin,
  FurnitureItemValidator.updateFurnitureItem,
  FurnitureItemController.updateFurnitureItem,
);

export default router;
