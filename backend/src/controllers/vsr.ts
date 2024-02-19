import { RequestHandler } from "express";
//import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import VSRModel from "src/models/vsr";
import FurnitureItemModel from "src/models/furnitureItem";
import validationErrorParser from "src/util/validationErrorParser";

export const getVSR: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const vsr = await VSRModel.findById(id).populate("name");

    if (vsr === null) {
      throw createHttpError(404, "VSR not found at id " + id);
    }
    res.status(200).json(vsr);
  } catch (error) {
    next(error);
  }
};

const fetchFurnitureItemIds = async () => {
  try {
    const furnitureItems = await FurnitureItemModel.find({}).select("_id");
    const ids = furnitureItems.map((item) => item.id);
    return ids;
  } catch (error) {
    console.error("Error fetching furniture item IDs:", error);
    throw error;
  }
};

export const createVSR: RequestHandler = async (req, res, next) => {
  // extract any errors that were found by the validator
  const errors = validationResult(req);
  const {
    name,
    date,
    gender,
    age,
    maritalStatus,
    spouseName,
    agesOfBoys,
    agesOfGirls,
    ethnicity,
    employmentStatus,
    incomeLevel,
    sizeOfHome,
  } = req.body;

  console.log(req.body);

  try {
    // if there are errors, then this function throws an exception
    validationErrorParser(errors);

    const furnitureItemIds = await fetchFurnitureItemIds();
    const vsr = await VSRModel.create({
      name,
      date,
      gender,
      age,
      maritalStatus,
      spouseName,
      agesOfBoys,
      agesOfGirls,
      ethnicity,
      employmentStatus,
      incomeLevel,
      sizeOfHome,
      furnitureItemIds,
    });

    // 201 means a new resource has been created successfully
    // the newly created task is sent back to the user
    res.status(201).json(vsr);
  } catch (error) {
    next(error);
  }
};
