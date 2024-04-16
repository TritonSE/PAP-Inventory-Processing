import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import FurnitureItemModel from "src/models/furnitureItem";
import validationErrorParser from "src/util/validationErrorParser";

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
  const errors = validationResult(req);
  try {
    validationErrorParser(errors);
    const furnitureItem = await FurnitureItemModel.create(req.body);
    res.status(201).json(furnitureItem);
  } catch (error) {
    next(error);
  }
};

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
};

export const updateFurnitureItem: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    const { id } = req.params;

    validationErrorParser(errors);

    const updatedFurnitureItem = await FurnitureItemModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedFurnitureItem == null) {
      throw createHttpError(404, "Furniture Item not found at id " + id);
    }

    res.status(200).json(updatedFurnitureItem);
  } catch (error) {
    next(error);
  }
};
