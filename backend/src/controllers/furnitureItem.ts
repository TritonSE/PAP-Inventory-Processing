import { RequestHandler } from "express";
import createHttpError from "http-errors";
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
    const furnitureItem = await FurnitureItemModel.create({
      ...req.body,

      
    });
  }
  catch(error){
    next(error);
  }
}

export const deleteFurnitureItem: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedFurnitureItem = await FurnitureItemModel.findByIdAndDelete(id);
    if (deletedFurnitureItem === null) {
      throw createHttpError(404, "FurnitureItem not found at id " + id);
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

