import { RequestHandler } from "express";
//import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import VSRModel from "src/models/vsr";
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
    status,
    lastUpdated,
    dateReceived,
    caseId,
    hearFrom,
    petCompanion,
    militaryId,
    lastRank,
    serviceConnected,
    dischargeStatus,
    email,
    phoneNumber,
    zipCode,
    state,
    city,
    streetAddress,
    numOfBoys,
    numOfGirls,
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
      status,
      lastUpdated,
      dateReceived,
      caseId,
      hearFrom,
      petCompanion,
      militaryId,
      lastRank,
      serviceConnected,
      dischargeStatus,
      email,
      phoneNumber,
      zipCode,
      state,
      city,
      streetAddress,
      numOfBoys,
      numOfGirls,
    });

    // 201 means a new resource has been created successfully
    // the newly created task is sent back to the user
    res.status(201).json(vsr);
  } catch (error) {
    next(error);
  }
};
