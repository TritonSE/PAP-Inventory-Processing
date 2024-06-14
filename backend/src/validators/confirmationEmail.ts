import { body } from "express-validator";
import validator from "html-validator";

const makeHTMLValidator = () =>
  body("html")
    .exists({ checkFalsy: true })
    .withMessage("HTML is required")
    .isString()
    .withMessage("HTML must be a string")
    .custom(async (html: string) => {
      try {
        validator({ data: html });
        return true;
      } catch (error) {
        return false;
      }
    });

export const updateConfirmationEmail = [makeHTMLValidator()];
