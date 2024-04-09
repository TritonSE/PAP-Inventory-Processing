import express from "express";
import { requireAdmin, requireSignedIn, requireStaffOrAdmin } from "src/middleware/auth";
import * as FurnitureItemController from "src/controllers/furnitureItem";

const router = express.Router();

router.get("/", FurnitureItemController.getFurnitureItems);
router.delete("/:id", requireSignedIn, requireStaffOrAdmin, FurnitureItemController.deleteFurnitureItem);


export default router;
