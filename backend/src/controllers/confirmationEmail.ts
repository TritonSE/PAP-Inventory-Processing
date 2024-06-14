import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import { PAPRequest } from "src/middleware/auth";
import {
  PAP_LOGO_HTML,
  retrieveConfirmaionEmail,
  updateConfirmationEmail as updateConfirmationEmailService,
} from "src/services/confirmationEmails";
import validationErrorParser from "src/util/validationErrorParser";

/**
 * Retrieves the VSR confirmation email from the database.
 */
export const getConfirmationEmail: RequestHandler = async (req: PAPRequest, res, next) => {
  try {
    const confirmationEmail = await retrieveConfirmaionEmail();
    res.status(200).json({ html: confirmationEmail.html, papLogoHTML: PAP_LOGO_HTML });
  } catch (error) {
    next(error);
  }
};

export const updateConfirmationEmail: RequestHandler = async (req: PAPRequest, res, next) => {
  const errors = validationResult(req);
  try {
    validationErrorParser(errors);
    const { html } = req.body;
    const sanitizedHTML = sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        // Frontend editor uses <ins> tags for underlining.
        "ins",
      ]),
    });
    const updatedConfirmationEmail = await updateConfirmationEmailService(sanitizedHTML);
    res.status(200).json(updatedConfirmationEmail);
  } catch (error) {
    next(error);
  }
};
