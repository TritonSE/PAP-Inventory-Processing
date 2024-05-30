"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.furntitureInputSchema = void 0;
const mongoose_1 = require("mongoose");
/**
 * A schema for a single furniture item that a veteran can request
 */
exports.furntitureInputSchema = new mongoose_1.Schema({
    // ID of the furniture item being required (Object ID for an instance of the furniture item model)
    furnitureItemId: { type: String, required: true },
    // Quantity being requested by this veteran
    quantity: { type: Number, required: true },
});
/**
 * A model for a VSR (veteran service request), submitted by a veteran to request
 * furniture items from PAP.
 */
const vsrSchema = new mongoose_1.Schema({
    /** Page 1 of VSR */
    name: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    maritalStatus: { type: String, required: true },
    spouseName: { type: String },
    agesOfBoys: { type: [Number] },
    agesOfGirls: { type: [Number] },
    ethnicity: { type: [String], required: true },
    employmentStatus: { type: String, required: true },
    incomeLevel: { type: String, required: true },
    sizeOfHome: { type: String, required: true },
    /** Page 2 of VSR */
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    branch: { type: [String], required: true },
    conflicts: { type: [String], required: true },
    dischargeStatus: { type: String, required: true },
    serviceConnected: { type: Boolean, required: true },
    lastRank: { type: String, required: true },
    militaryID: { type: Number, required: true },
    petCompanion: { type: Boolean, required: true },
    hearFrom: { type: String, required: true },
    /** Page 3 of VSR */
    selectedFurnitureItems: { type: [exports.furntitureInputSchema], required: true },
    additionalItems: { type: String, required: false },
    /** Fields that are created/updated automatically or on staff side */
    dateReceived: { type: Date, required: true },
    lastUpdated: { type: Date, required: true },
    status: { type: String, required: true },
});
vsrSchema.index({ name: "text" });
exports.default = (0, mongoose_1.model)("VSR", vsrSchema);
