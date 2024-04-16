import express from "express";
import { requireSignedIn, requireStaffOrAdmin } from "src/middleware/auth";
import * as FurnitureItemController from "src/controllers/furnitureItem";
import * as FurnitureItemValidator from "src/validators/furnitureItem";

const router = express.Router();

router.get("/", FurnitureItemController.getFurnitureItems);
router.post(
  "/",
  requireSignedIn,
  requireStaffOrAdmin,
  FurnitureItemValidator.createFurnitureItem,
  FurnitureItemController.createFurnitureItem,
);
router.delete(
  "/:id",
  requireSignedIn,
  requireStaffOrAdmin,
  FurnitureItemController.deleteFurnitureItem,
);
router.put(
  "/:id",
  requireSignedIn,
  requireStaffOrAdmin,
  FurnitureItemValidator.updateFurnitureItem,
  FurnitureItemController.updateFurnitureItem,
);

export default router;
