"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * A model for the confirmation email sent to veterans when they fill out the
 * VSR. Only one instance of this model will ever exist at once.
 */
const confirmationEmailSchema = new mongoose_1.Schema({
    // The HTML of the email
    html: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("ConfirmationEmail", confirmationEmailSchema);
