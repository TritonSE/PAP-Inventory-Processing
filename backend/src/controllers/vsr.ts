import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import VSRModel from "src/models/vsr";
import {
  sendVSRConfirmationEmailToVeteran,
  sendVSRNotificationEmailToStaff,
} from "src/services/emails";
import validationErrorParser from "src/util/validationErrorParser";
import ExcelJS from "exceljs";

/**
 * Gets all VSRs in the database. Requires the user to be signed in and have
 * staff or admin permission.
 */
export const getAllVSRS: RequestHandler = async (req, res, next) => {
  try {
    const vsrs = await VSRModel.find();

    res.status(200).json({ vsrs });
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

const writeSpreadsheet = async (filename: string) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "PAP Inventory System";
  workbook.lastModifiedBy = "Bot";
  //current date
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  const worksheet = workbook.addWorksheet("New Sheet");

  const vsrs = await VSRModel.find();
  const plainVsrs = vsrs.map((doc) => doc.toObject());

  // Setup columns headers based on keys from the first object in the plainVsrs array
  if (plainVsrs.length > 0) {
    worksheet.columns = Object.keys(plainVsrs[0]).map((key) => ({
      header: key,
      key: key,
      width: 20,
    }));

    // Add data rows to the worksheet
    plainVsrs.forEach((item) => {
      worksheet.addRow(item);

      //cast each element in the row to a string

      //for the row that was just added in the spreadsheet, if there are brackets surrounding any of the entries, remove them
      if (worksheet.lastRow) {
        worksheet.lastRow.eachCell((cell) => {
          if (cell.value && !(typeof cell.value === "number")) {
            cell.value = cell.value.toString();
          }
        });

        worksheet.lastRow.eachCell((cell) => {
          if (
            cell.value &&
            typeof cell.value == "string" &&
            cell.value[0] === "[" &&
            cell.value[cell.value.length - 1] === "]"
          ) {
            cell.value = cell.value.slice(1, -1);
          }
        });
      }
    });

    // Write to file
    await workbook.xlsx.writeFile(filename);
  }
};

export const bulkExportVSRS: RequestHandler = async (req, res, next) => {
  try {
    console.log("inside bulk export vsrs");
    const filename = "vsrs.xlsx";
    await writeSpreadsheet(filename);
    res.download(filename);
  } catch (error) {
    next(error);
  }
};
