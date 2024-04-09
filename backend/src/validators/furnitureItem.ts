import { body } from "express-validator";


const makeCategoryValidator = () =>
    body("category")
        .exists({ checkFalsy: true })
        .withMessage("Category is required")
        .isString()
        .withMessage("Category must be a string");

const makeNameValidator = () => 
    body("name")
        .exists({ checkFalsy: true })
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string");

const makeAllowMultipleValidator = () =>
    body("allowMultiple")
        .exists({ checkFalsy: false })
        .withMessage("Must specify if multiple of these items can be requested")
        .isBoolean()
        .withMessage("allowMultiple must be a boolean");

const makeCategoryIndexValidator = () =>
    body("categoryIndex")
        .exists({ checkFalsy: true })
        .withMessage("Category index is required")
        .isInt({ min: 0 })
        .withMessage("Category index must be positive and an integer")

export const createFurnitureItem = [
    makeCategoryValidator(),
    makeNameValidator(),
    makeAllowMultipleValidator(),
    makeCategoryIndexValidator()
]

