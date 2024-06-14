"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFurnitureItem = exports.createFurnitureItem = void 0;
const express_validator_1 = require("express-validator");
const makeCategoryValidator = () => (0, express_validator_1.body)("category")
    .exists({ checkFalsy: true })
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string");
const makeNameValidator = () => (0, express_validator_1.body)("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string");
const makeAllowMultipleValidator = () => (0, express_validator_1.body)("allowMultiple")
    .exists({ checkFalsy: false })
    .withMessage("Must specify if multiple of these items can be requested")
    .isBoolean()
    .withMessage("allowMultiple must be a boolean");
const makeCategoryIndexValidator = () => (0, express_validator_1.body)("categoryIndex")
    .exists({ checkFalsy: true })
    .withMessage("Category index is required")
    .isInt({ min: 0 })
    .withMessage("Category index must be positive and an integer");
exports.createFurnitureItem = [
    makeCategoryValidator(),
    makeNameValidator(),
    makeAllowMultipleValidator(),
    makeCategoryIndexValidator(),
];
exports.updateFurnitureItem = [
    makeCategoryValidator(),
    makeNameValidator(),
    makeAllowMultipleValidator(),
    makeCategoryIndexValidator(),
];
