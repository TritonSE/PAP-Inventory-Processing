"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkExportVSRS = exports.deleteVSR = exports.updateVSR = exports.updateStatus = exports.createVSR = exports.getVSR = exports.getAllVSRS = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const furnitureItem_1 = __importDefault(require("../models/furnitureItem"));
const vsr_1 = __importDefault(require("../models/vsr"));
const emails_1 = require("../services/emails");
const vsrs_1 = require("../services/vsrs");
const validationErrorParser_1 = __importDefault(require("../util/validationErrorParser"));
const exceljs_1 = __importDefault(require("exceljs"));
/**
 * Gets all VSRs in the database. Requires the user to be signed in and have
 * staff or admin permission.
 */
const getAllVSRS = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vsrs = yield (0, vsrs_1.retrieveVSRs)(req.query.search, req.query.status, req.query.incomeLevel, req.query.zipCode ? req.query.zipCode.split(",") : undefined, undefined);
        res.status(200).json({ vsrs });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllVSRS = getAllVSRS;
/**
 * Retrieves a single VSR by its ID. Requires the user to get signed in and have
 * staff or admin permission.
 */
const getVSR = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const vsr = yield vsr_1.default.findById(id);
        if (vsr === null) {
            throw (0, http_errors_1.default)(404, "VSR not found at id " + id);
        }
        res.status(200).json(vsr);
    }
    catch (error) {
        next(error);
    }
});
exports.getVSR = getVSR;
/**
 * Creates a new VSR in the database, called when a veteran submits the VSR form.
 * Does not require authentication.
 */
const createVSR = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract any errors that were found by the validator
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        // if there are errors, then this function throws an exception
        (0, validationErrorParser_1.default)(errors);
        // Get the current date as a timestamp for when VSR was submitted
        const currentDate = new Date();
        const vsr = yield vsr_1.default.create(Object.assign(Object.assign({}, req.body), { 
            // Use current date as timestamp for received & updated
            dateReceived: currentDate, lastUpdated: currentDate, status: "Received" }));
        // Once the VSR is created successfully, send notification & confirmation emails
        (0, emails_1.sendVSRNotificationEmailToStaff)(req.body.name, req.body.email, vsr._id.toString());
        (0, emails_1.sendVSRConfirmationEmailToVeteran)(req.body.name, req.body.email);
        // 201 means a new resource has been created successfully
        // the newly created VSR is sent back to the user
        res.status(201).json(vsr);
    }
    catch (error) {
        next(error);
    }
});
exports.createVSR = createVSR;
/**
 * Updates a VSR's status, by its ID. Requires the user to be signed in and
 * have staff or admin permission.
 */
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // extract any errors that were found by the validator
        const errors = (0, express_validator_1.validationResult)(req);
        const { status } = req.body;
        // if there are errors, then this function throws an exception
        (0, validationErrorParser_1.default)(errors);
        // Get the current date as a timestamp for when VSR was updated
        const currentDate = new Date();
        const { id } = req.params;
        const vsr = yield vsr_1.default.findByIdAndUpdate(id, { status, lastUpdated: currentDate }, { new: true });
        if (vsr === null) {
            throw (0, http_errors_1.default)(404, "VSR not found at id " + id);
        }
        res.status(200).json(vsr);
    }
    catch (error) {
        next(error);
    }
});
exports.updateStatus = updateStatus;
/**
 * Updates a VSR's data, by its ID. Requires the user to be signed in and
 * have staff or admin permission.
 */
const updateVSR = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        const { id } = req.params;
        // Get the current date as a timestamp for when VSR was updated
        const currentDate = new Date();
        (0, validationErrorParser_1.default)(errors);
        const updatedVSR = yield vsr_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { lastUpdated: currentDate }), { new: true });
        if (updatedVSR === null) {
            throw (0, http_errors_1.default)(404, "VSR not found at id " + id);
        }
        res.status(200).json(updatedVSR);
    }
    catch (error) {
        next(error);
    }
});
exports.updateVSR = updateVSR;
/**
 * Deletes a VSR from the database, by its ID. Requires the user to be signed in
 * and have admin permission.
 */
const deleteVSR = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedVsr = yield vsr_1.default.findByIdAndDelete(id);
        if (deletedVsr === null) {
            throw (0, http_errors_1.default)(404, "VSR not found at id " + id);
        }
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteVSR = deleteVSR;
/**
 * Converts an entry in a VSR to a formatted string to write to the Excel spreadsheet
 */
const stringifyEntry = (entry) => {
    if (entry === undefined || entry === null) {
        return "";
    }
    if (Array.isArray(entry)) {
        return entry.join(", ");
    }
    else if (typeof entry === "boolean") {
        return entry ? "yes" : "no";
    }
    else {
        return entry.toString();
    }
};
/**
 * Formats a VSR's selected furniture items as a string
 */
const stringifySelectedFurnitureItems = (selectedItems, allFurnitureItems) => {
    if (!selectedItems) {
        return "";
    }
    const itemIdsToItems = {};
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
const writeSpreadsheet = (plainVsrs, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new exceljs_1.default.Workbook();
    workbook.creator = "PAP Inventory System";
    workbook.lastModifiedBy = "Bot";
    //current date
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    const worksheet = workbook.addWorksheet("New Sheet");
    // Fields that we want to write to the spreadsheet. First is field name, second is display name.
    const fieldsToWrite = [
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
    const allFurnitureItems = yield furnitureItem_1.default.find();
    // Add data rows to the worksheet
    plainVsrs.forEach((vsr) => {
        worksheet.addRow(fieldsToWrite.reduce((prev, field) => (Object.assign(Object.assign({}, prev), { [field[0]]: field[0] === "selectedFurnitureItems"
                ? stringifySelectedFurnitureItems(vsr[field[0]], allFurnitureItems)
                : stringifyEntry(vsr[field[0]]) })), {}));
    });
    // Write to file
    yield workbook.xlsx.write(res);
});
const bulkExportVSRS = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filename = `vsrs_${new Date().toISOString()}.xlsx`;
        // Set some headers on the response so the client knows that a file is attached
        res.set({
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const vsrs = yield (0, vsrs_1.retrieveVSRs)(req.query.search, req.query.status, req.query.incomeLevel, req.query.zipCode ? req.query.zipCode.split(",") : undefined, req.query.vsrIds ? req.query.vsrIds.split(",") : undefined);
        yield writeSpreadsheet(vsrs, res);
    }
    catch (error) {
        next(error);
    }
});
exports.bulkExportVSRS = bulkExportVSRS;
