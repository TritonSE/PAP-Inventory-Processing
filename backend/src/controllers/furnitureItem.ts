import { RequestHandler } from "express";
import FurnitureItemModel from "src/models/furnitureItem";

/**
 * Gets all available furniture items in the database. Does not require authentication.
 */
export const getFurnitureItems: RequestHandler = async (req, res, next) => {
  try {
    const furnitureItems = await FurnitureItemModel.find();

    res.status(200).json(furnitureItems);
  } catch (error) {
    next(error);
  }
};
