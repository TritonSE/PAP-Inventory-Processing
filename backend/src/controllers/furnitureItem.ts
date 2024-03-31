import { RequestHandler } from "express";
import FurnitureItemModel from "src/models/furnitureItem";

export const getFurnitureItems: RequestHandler = async (req, res, next) => {
  try {
    const furnitureItems = await FurnitureItemModel.find();

    res.status(200).json(furnitureItems);
  } catch (error) {
    next(error);
  }
};
