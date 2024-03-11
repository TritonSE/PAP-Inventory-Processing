import { RequestHandler } from "express";
import createHttpError from "http-errors";
import FurnitureItemModel from "src/models/furnitureItem";

export const getFurnitureItems: RequestHandler = async (req, res, next) => {
  try {
    const furnitureItems = await FurnitureItemModel.find();

    if (furnitureItems === null) {
      throw createHttpError(404, "Furniture items not found");
    }
    res.status(200).json(furnitureItems);
  } catch (error) {
    next(error);
  }
};
