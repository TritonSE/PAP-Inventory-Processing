import { RequestHandler } from "express";
import FurnitureItemModel from "src/models/furnitureItem";

/**
 * Gets all available furniture items in the database. Does not require authentication.
 */
export const getFurnitureItems: RequestHandler = async (req, res, next) => {
  try {
    const furnitureItems = await FurnitureItemModel.find().sort({
      // First, sort the items by whether they allow multiple (true before false)
      allowMultiple: -1,

      // Second, sort by category index (ascending)
      categoryIndex: 1,
    });

    res.status(200).json(furnitureItems);
  } catch (error) {
    next(error);
  }
};

export const createFurnitureItem: RequestHandler = async (req, res, next) => {
  try{
    const furnitureItem = await FurnitureItemModel.create(
      req.body
    );
    res.status(201).json(furnitureItem);
  }
  catch(error){
    next(error);
  }
}


