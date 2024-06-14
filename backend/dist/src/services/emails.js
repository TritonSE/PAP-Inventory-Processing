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
exports.sendPasswordChangedEmailToAdmin = exports.sendOwnPasswordChangedNotificationEmail = exports.sendVSRConfirmationEmailToVeteran = exports.sendVSRNotificationEmailToStaff = void 0;
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const confirmationEmails_1 = require("../services/confirmationEmails");
const validateEnv_1 = __importDefault(require("../util/validateEnv"));
const trimmedFrontendUrl = validateEnv_1.default.FRONTEND_ORIGIN.replace(
// Trim trailing slash from frontend URL, if there is one
/\/$/gi, "");
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: validateEnv_1.default.EMAIL_USER,
            pass: validateEnv_1.default.EMAIL_APP_PASSWORD,
        },
    });
    const mailOptions = Object.assign({ from: validateEnv_1.default.EMAIL_USER }, options);
    yield transporter.sendMail(mailOptions);
});
/**
 * Sends a notification email to PAP staff when a VSR is submitted.
 * Throws an error if the email could not be sent.
 *
 * @param name Name of veteran who submitted the VSR
 * @param email Email address of veteran who submitted the VSR
 * @param id ID of the submitted VSR, used to construct a link to the VSR on our web app
 */
const sendVSRNotificationEmailToStaff = (name, email, id) => __awaiter(void 0, void 0, void 0, function* () {
    const EMAIL_SUBJECT = "New VSR Submitted";
    const EMAIL_BODY = `A new VSR was submitted by ${name} from ${email}. You can view it at ${trimmedFrontendUrl}/staff/vsr/${id}`;
    yield sendEmail({
        to: validateEnv_1.default.EMAIL_NOTIFICATIONS_RECIPIENT,
        subject: EMAIL_SUBJECT,
        text: EMAIL_BODY,
    });
});
exports.sendVSRNotificationEmailToStaff = sendVSRNotificationEmailToStaff;
/**
 * Sends a confirmation email to the veteran who submitted a VSR.
 * Throws an error if the email could not be sent.
 *
 * @param name Name of veteran who submitted the VSR
 * @param email Email address of veteran who submitted the VSR
 */
const sendVSRConfirmationEmailToVeteran = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    const EMAIL_SUBJECT = "VSR Submission Confirmation";
    const confirmationEmail = yield (0, confirmationEmails_1.retrieveConfirmaionEmail)();
    const emailHTML = confirmationEmail.html.replace(confirmationEmails_1.RECIPIENT_TEXT, name) + confirmationEmails_1.PAP_LOGO_HTML;
    yield sendEmail({
        to: email,
        subject: EMAIL_SUBJECT,
        html: emailHTML,
        attachments: [
            {
                filename: "pap_logo.png",
                path: `${__dirname}/../../public/pap_logo.png`,
                cid: "pap_logo.png",
            },
        ],
    });
});
exports.sendVSRConfirmationEmailToVeteran = sendVSRConfirmationEmailToVeteran;
const sendOwnPasswordChangedNotificationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const EMAIL_SUBJECT = "PAP Application Password Change Confirmation";
    const EMAIL_BODY = `Your password for the ${email} account has been changed.`;
    yield sendEmail({
        to: email,
        subject: EMAIL_SUBJECT,
        text: EMAIL_BODY,
    });
});
exports.sendOwnPasswordChangedNotificationEmail = sendOwnPasswordChangedNotificationEmail;
const sendPasswordChangedEmailToAdmin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const EMAIL_SUBJECT = "PAP Application Password Change Notification";
    const EMAIL_BODY = `The password for the ${email} account has been changed.`;
    yield sendEmail({
        to: validateEnv_1.default.EMAIL_NOTIFICATIONS_RECIPIENT,
        subject: EMAIL_SUBJECT,
        text: EMAIL_BODY,
    });
});
exports.sendPasswordChangedEmailToAdmin = sendPasswordChangedEmailToAdmin;
