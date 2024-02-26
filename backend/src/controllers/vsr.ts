import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import VSRModel from "src/models/vsr";
import validationErrorParser from "src/util/validationErrorParser";

export const createVSR: RequestHandler = async (req, res, next) => {
  // extract any errors that were found by the validator
  const errors = validationResult(req);
  const {
    name,
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

  try {
    // if there are errors, then this function throws an exception
    validationErrorParser(errors);

    // Get the current date as a timestamp for when VSR was submitted
    const date = new Date();

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
    });

    // 201 means a new resource has been created successfully
    // the newly created VSR is sent back to the user
    res.status(201).json(vsr);
  } catch (error) {
    next(error);
  }
};

export const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const vsr = await VSRModel.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(vsr);
    
  } catch (error) {
    next(error);
  }
}