import { RequestHandler } from "express";
//import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import VSRModel from "src/models/vsr";
import validationErrorParser from "src/util/validationErrorParser";

export const createVSR: RequestHandler = async (req, res, next) => {
  // extract any errors that were found by the validator
  const errors = validationResult(req);
  const {
    name,
    date,
    gender,
    age,
    martialStatus,
    spouseName,
    numOfBoys,
    numOfGirls,
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

    const vsr = await VSRModel.create({
      name: name,
      date: date,
      gender: gender,
      age: age,
      martialStatus: martialStatus,
      spouseName: spouseName,
      numOfBoys: numOfBoys,
      numOfGirls: numOfGirls,
      agesOfBoys: agesOfBoys,
      agesOfGirls: agesOfGirls,
      ethnicity: ethnicity,
      employmentStatus: employmentStatus,
      incomeLevel: incomeLevel,
      sizeOfHome: sizeOfHome,
    });

    // 201 means a new resource has been created successfully
    // the newly created task is sent back to the user
    res.status(201).json(vsr);
  } catch (error) {
    next(error);
  }
};
