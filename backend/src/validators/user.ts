import { body } from "express-validator";

/**
 * Validators for creating and updating users
 */

const makeNameValidator = () =>
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string");

const makeEmailValidator = () =>
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string");

const makePasswordValidator = () =>
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string");

export const createUser = [makeNameValidator(), makeEmailValidator(), makePasswordValidator()];

export const changeUserPassword = [makePasswordValidator()];
