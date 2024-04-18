import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import FurnitureItemModel, { FurnitureItem } from "src/models/furnitureItem";
import VSRModel, { FurnitureInput, VSR } from "src/models/vsr";
import {
  sendVSRConfirmationEmailToVeteran,
  sendVSRNotificationEmailToStaff,
} from "src/services/emails";
import validationErrorParser from "src/util/validationErrorParser";
import ExcelJS from "exceljs";
import { ObjectId } from "mongodb";

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

/**
 * Converts an entry in a VSR to a formatted string to write to the Excel spreadsheet
 */
const stringifyEntry = (
  entry: string | number | string[] | number[] | boolean | Date | undefined,
) => {
  if (!entry) {
    return "";
  }

  if (Array.isArray(entry)) {
    return entry.join(", ");
  } else {
    return entry.toString();
  }
};

type FurnitureItemEntry = FurnitureItem & { _id: ObjectId };

/**
 * Formats a VSR's selected furniture items as a string
 */
const stringifySelectedFurnitureItems = (
  selectedItems: FurnitureInput[] | undefined,
  allFurnitureItems: FurnitureItemEntry[],
) => {
  if (!selectedItems) {
    return "";
  }

  const itemIdsToItems: Record<string, FurnitureItem> = {};

  for (const furnitureItem of allFurnitureItems) {
    itemIdsToItems[furnitureItem._id.toString()] = furnitureItem;
  }

  return selectedItems
    .map((selectedItem) => {
      const furnitureItem = itemIdsToItems[selectedItem.furnitureItemId];
      return furnitureItem ? `${furnitureItem.name}: ${selectedItem.quantity}` : "[unknown]";
    })
    .join(", ");
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

  // Fields that we want to write to the spreadsheet. First is field name, second is display name.
  const fieldsToWrite: [keyof VSR, string][] = [
    ["name", "Name"],
    ["gender", "Gender"],
    ["age", "Age"],
    ["maritalStatus", "Marital Status"],
    ["spouseName", "Spouse Name"],
    ["agesOfBoys", "Ages of boys"],
    ["agesOfGirls", "Ages of girls"],
    ["ethnicity", "Ethnicity"],
    ["employmentStatus", "Employment Status"],
    ["incomeLevel", "Income Level"],
    ["sizeOfHome", "Size of Home"],

    ["streetAddress", "Street Address"],
    ["city", "City"],
    ["state", "State"],
    ["zipCode", "Zip Code"],
    ["phoneNumber", "Phone Number"],
    ["email", "Email Address"],
    ["branch", "Branch"],
    ["conflicts", "Conflicts"],
    ["dischargeStatus", "Discharge Status"],
    ["serviceConnected", "Service Connected"],
    ["lastRank", "Last Rank"],
    ["militaryID", "Military ID"],
    ["petCompanion", "Pet Companion Desired"],
    ["hearFrom", "Referral Source"],

    ["selectedFurnitureItems", "Selected Furniture Items"],
    ["additionalItems", "Additional Items"],

    ["dateReceived", "Date Received"],
    ["lastUpdated", "Last Updated"],
    ["status", "Status"],
  ];

  worksheet.columns = fieldsToWrite.map((field) => ({
    header: field[1],
    key: field[0],
    width: 20,
  }));

  const allFurnitureItems = await FurnitureItemModel.find();

  // Add data rows to the worksheet
  plainVsrs.forEach((vsr) => {
    worksheet.addRow(
      fieldsToWrite.reduce(
        (prev, field) => ({
          ...prev,
          [field[0]]:
            field[0] === "selectedFurnitureItems"
              ? stringifySelectedFurnitureItems(
                  vsr[field[0]] as FurnitureInput[] | undefined,
                  allFurnitureItems,
                )
              : stringifyEntry(vsr[field[0]]),
        }),
        {},
      ),
    );
  });

  // Write to file
  await workbook.xlsx.writeFile(filename);
};

export const bulkExportVSRS: RequestHandler = async (req, res, next) => {
  try {
    const filename = "vsrs.xlsx";
    await writeSpreadsheet(filename);
    res.download(filename);
  } catch (error) {
    next(error);
  }
};
