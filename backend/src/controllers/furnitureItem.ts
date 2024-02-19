import { RequestHandler } from "express";
//import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import FurnitureItemodel from "src/models/furnitureItem";
import validationErrorParser from "src/util/validationErrorParser";

export const createFurnitureItem: RequestHandler = async (req, res, next) => {
  // extract any errors that were found by the validator
  const errors = validationResult(req);
  const { category, name, isGasElectric, allowMultiple, categoryIndex } = req.body;

  console.log(req.body);

  try {
    // if there are errors, then this function throws an exception
    validationErrorParser(errors);

    const vsr = await FurnitureItemodel.create({
      category,
      name,
      isGasElectric,
      allowMultiple,
      categoryIndex,
    });

    // 201 means a new resource has been created successfully
    // the newly created task is sent back to the user
    res.status(201).json(vsr);
  } catch (error) {
    next(error);
  }
};
