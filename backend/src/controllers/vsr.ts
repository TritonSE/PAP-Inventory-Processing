import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import VSRModel from "src/models/vsr";
import {
  sendVSRConfirmationEmailToVeteran,
  sendVSRNotificationEmailToStaff,
} from "src/services/emails";
import validationErrorParser from "src/util/validationErrorParser";

/**
 * Gets all VSRs in the database. Requires the user to be signed in and have
 * staff or admin permission.
 */
export const getAllVSRS: RequestHandler = async (req, res, next) => {
  const pipeline = [
    {
      $addFields: {
        sort_order: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "Received"] }, then: 1 },
              { case: { $eq: ["$status", "Approved"] }, then: 2 },
              { case: { $eq: ["$status", "Appointment Scheduled"] }, then: 3 },
              { case: { $eq: ["$status", "Complete"] }, then: 4 },
              { case: { $eq: ["$status", "No-show / Incomplete"] }, then: 5 },
              { case: { $eq: ["$status", "Archived"] }, then: 6 },
            ],
            default: 7,
          },
        },
      },
    },
    {
      $sort: { sort_order: 1, date_received: -1 },
    },
    {
      $project: { sort_order: 0 },
    },
  ];

  try {
    if (req.query.search) {
      const vsrs = await VSRModel.find({ $text: { $search: req.query.search as string } });
      res.status(200).json({ vsrs });
    } else {
      const vsrs = await VSRModel.find().sort({
        //by status in a particular order
        status: 1,
        //and then by name
        name: 1,
      });
      res.status(200).json({ vsrs });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single VSR by its ID. Requires the user to get signed in and have
 * staff or admin permission.
 */
export const getVSR: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const vsr = await VSRModel.findById(id);

    if (vsr === null) {
      throw createHttpError(404, "VSR not found at id " + id);
    }
    res.status(200).json(vsr);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new VSR in the database, called when a veteran submits the VSR form.
 * Does not require authentication.
 */
export const createVSR: RequestHandler = async (req, res, next) => {
  // Extract any errors that were found by the validator
  const errors = validationResult(req);

  try {
    // if there are errors, then this function throws an exception
    validationErrorParser(errors);

    // Get the current date as a timestamp for when VSR was submitted
    const currentDate = new Date();

    const vsr = await VSRModel.create({
      ...req.body,

      // Use current date as timestamp for received & updated
      dateReceived: currentDate,
      lastUpdated: currentDate,

      status: "Received",
    });

    // Once the VSR is created successfully, send notification & confirmation emails
    sendVSRNotificationEmailToStaff(req.body.name, req.body.email, vsr._id.toString());
    sendVSRConfirmationEmailToVeteran(req.body.name, req.body.email);

    // 201 means a new resource has been created successfully
    // the newly created VSR is sent back to the user
    res.status(201).json(vsr);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a VSR's status, by its ID. Requires the user to be signed in and
 * have staff or admin permission.
 */
export const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    // extract any errors that were found by the validator
    const errors = validationResult(req);
    const { status } = req.body;

    // if there are errors, then this function throws an exception
    validationErrorParser(errors);

    // Get the current date as a timestamp for when VSR was updated
    const currentDate = new Date();

    const { id } = req.params;
    const vsr = await VSRModel.findByIdAndUpdate(
      id,
      { status, lastUpdated: currentDate },
      { new: true },
    );
    if (vsr === null) {
      throw createHttpError(404, "VSR not found at id " + id);
    }
    res.status(200).json(vsr);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a VSR's data, by its ID. Requires the user to be signed in and
 * have staff or admin permission.
 */
export const updateVSR: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    const { id } = req.params;

    // Get the current date as a timestamp for when VSR was updated
    const currentDate = new Date();

    validationErrorParser(errors);
    const updatedVSR = await VSRModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        lastUpdated: currentDate,
      },
      { new: true },
    );
    if (updatedVSR === null) {
      throw createHttpError(404, "VSR not found at id " + id);
    }
    res.status(200).json(updatedVSR);
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a VSR from the database, by its ID. Requires the user to be signed in
 * and have admin permission.
 */
export const deleteVSR: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedVsr = await VSRModel.findByIdAndDelete(id);
    if (deletedVsr === null) {
      throw createHttpError(404, "VSR not found at id " + id);
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
