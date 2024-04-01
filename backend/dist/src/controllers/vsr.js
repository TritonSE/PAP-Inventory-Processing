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
exports.deleteVSR = exports.updateStatus = exports.createVSR = exports.getVSR = exports.getAllVSRS = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const vsr_1 = __importDefault(require("../models/vsr"));
const validationErrorParser_1 = __importDefault(require("../util/validationErrorParser"));
const getAllVSRS = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vsrs = yield vsr_1.default.find();
        res.status(200).json({ vsrs });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllVSRS = getAllVSRS;
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
const createVSR = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // extract any errors that were found by the validator
    const errors = (0, express_validator_1.validationResult)(req);
    const { name, gender, age, maritalStatus, spouseName, agesOfBoys, agesOfGirls, ethnicity, employmentStatus, incomeLevel, sizeOfHome, streetAddress, city, state, zipCode, phoneNumber, email, branch, conflicts, dischargeStatus, serviceConnected, lastRank, militaryID, petCompanion, hearFrom, selectedFurnitureItems, additionalItems, } = req.body;
    try {
        // if there are errors, then this function throws an exception
        (0, validationErrorParser_1.default)(errors);
        // Get the current date as a timestamp for when VSR was submitted
        const currentDate = new Date();
        const vsr = yield vsr_1.default.create({
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
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            email,
            branch,
            conflicts,
            dischargeStatus,
            serviceConnected,
            lastRank,
            militaryID,
            petCompanion,
            hearFrom,
            // Use current date as timestamp for received & updated
            dateReceived: currentDate,
            lastUpdated: currentDate,
            status: "Received",
            selectedFurnitureItems,
            additionalItems,
        });
        // 201 means a new resource has been created successfully
        // the newly created VSR is sent back to the user
        res.status(201).json(vsr);
    }
    catch (error) {
        next(error);
    }
});
exports.createVSR = createVSR;
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // extract any errors that were found by the validator
        const errors = (0, express_validator_1.validationResult)(req);
        const { status } = req.body;
        // if there are errors, then this function throws an exception
        (0, validationErrorParser_1.default)(errors);
        const { id } = req.params;
        const vsr = yield vsr_1.default.findByIdAndUpdate(id, { status }, { new: true });
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
