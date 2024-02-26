import { RequestHandler } from "express";
//import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import VSRModel, { VSR } from "../models/vsr";
import validationErrorParser from "../util/validationErrorParser";
import mongoose from "mongoose";

// start the database
mongoose.connect("mongodb://localhost:27017/pap", {});

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
    // the newly created task is sent back to the user
    res.status(201).json(vsr);
  } catch (error) {
    next(error);
  }
};

export async function getAllVSRS(): Promise<VSR[]> {
  try {
    const vsrs: VSR[] = await VSRModel.find().lean().exec();
    // console.log(vsrs[0].name);ystal

    return vsrs;
  } catch (error: any) {
    throw new Error(`Error retrieving VSRs: ${error.message}`);
  }
}

// getAllVSRS()
//   .then((vsrs) => {
//     console.log("All VSRs:", vsrs);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
