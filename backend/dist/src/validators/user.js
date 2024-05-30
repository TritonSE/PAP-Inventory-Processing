"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPassword = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validators for creating and updating users
 */
const makeNameValidator = () => (0, express_validator_1.body)("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string");
const makeEmailValidator = () => (0, express_validator_1.body)("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string");
const makePasswordValidator = () => (0, express_validator_1.body)("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string");
exports.createUser = [makeNameValidator(), makeEmailValidator(), makePasswordValidator()];
exports.changeUserPassword = [makePasswordValidator()];
