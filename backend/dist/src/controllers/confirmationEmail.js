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
exports.updateConfirmationEmail = exports.getConfirmationEmail = void 0;
const express_validator_1 = require("express-validator");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const confirmationEmails_1 = require("../services/confirmationEmails");
const validationErrorParser_1 = __importDefault(require("../util/validationErrorParser"));
/**
 * Retrieves the VSR confirmation email from the database.
 */
const getConfirmationEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const confirmationEmail = yield (0, confirmationEmails_1.retrieveConfirmaionEmail)();
        res.status(200).json({ html: confirmationEmail.html, papLogoHTML: confirmationEmails_1.PAP_LOGO_HTML });
    }
    catch (error) {
        next(error);
    }
});
exports.getConfirmationEmail = getConfirmationEmail;
const updateConfirmationEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        (0, validationErrorParser_1.default)(errors);
        const { html } = req.body;
        const sanitizedHTML = (0, sanitize_html_1.default)(html, {
            allowedTags: sanitize_html_1.default.defaults.allowedTags.concat([
                // Frontend editor uses <ins> tags for underlining.
                "ins",
            ]),
        });
        const updatedConfirmationEmail = yield (0, confirmationEmails_1.updateConfirmationEmail)(sanitizedHTML);
        res.status(200).json(updatedConfirmationEmail);
    }
    catch (error) {
        next(error);
    }
});
exports.updateConfirmationEmail = updateConfirmationEmail;
