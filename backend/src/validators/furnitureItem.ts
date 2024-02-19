import { body } from "express-validator";

const makeCategoryValidator = () =>
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string");

export const createFurnitureItem = [makeCategoryValidator()];
