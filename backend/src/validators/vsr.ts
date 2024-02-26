import { body } from "express-validator";

const makeNameValidator = () =>
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string");

const makeGenderValidator = () =>
  body("gender")
    .exists({ checkFalsy: true })
    .withMessage("Gender is required")
    .isString()
    .withMessage("Gender must be a string");

const makeAgeValidator = () =>
  body("age")
    .exists({ checkFalsy: true })
    .withMessage("Age is required")
    .isInt({ min: 0 })
    .withMessage("Age must be a positive integer");

const makeMaritalStatusValidator = () =>
  body("maritalStatus")
    .exists({ checkFalsy: true })
    .withMessage("Marital Status is required")
    .isString()
    .withMessage("Marital Status must be a string");

const makeSpouseNameValidator = () =>
  body("spouseName")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Spouse Name must be a string");

const makeAgesOfBoysValidator = () =>
  body("agesOfBoys")
    .exists({ checkFalsy: true })
    .isArray()
    .withMessage("Ages of Boys must be an array of numbers")
    .custom((ages: number[]) => ages.every((age) => Number.isInteger(age) && age >= 0))
    .withMessage("Each age in Ages of Boys must be a positive integer");

const makeAgesOfGirlsValidator = () =>
  body("agesOfGirls")
    .exists({ checkFalsy: true })
    .isArray()
    .withMessage("Ages of Girls must be an array of numbers")
    .custom((ages: number[]) => ages.every((age) => Number.isInteger(age) && age >= 0))
    .withMessage("Each age in Ages of Girls must be a positive integer");

const makeEthnicityValidator = () =>
  body("ethnicity")
    .exists({ checkFalsy: true })
    .withMessage("Ethnicity is required")
    .isArray()
    .withMessage("Ethnicity must be an array")
    .custom((ethnicities: string[]) =>
      ethnicities.every((ethnicity) => typeof ethnicity === "string"),
    )
    .withMessage("Each ethnicity in Ethnicities must be a positive integer");

const makeEmploymentStatusValidator = () =>
  body("employmentStatus")
    .exists({ checkFalsy: true })
    .withMessage("Employment Status is required")
    .isString()
    .withMessage("Employment Status must be a string");

const makeIncomeLevelValidator = () =>
  body("incomeLevel")
    .exists({ checkFalsy: true })
    .withMessage("Income Level is required")
    .isString()
    .withMessage("Income Level must be a string");

const makeSizeOfHomeValidator = () =>
  body("sizeOfHome")
    .exists({ checkFalsy: true })
    .withMessage("Size of Home is required")
    .isString()
    .withMessage("Size of Home must be a string");

const updateStatusValidator = () =>
  body("status")
    .exists({ checkFalsy: true })
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string");

export const createVSR = [
  makeNameValidator(),
  makeGenderValidator(),
  makeAgeValidator(),
  makeMaritalStatusValidator(),
  makeSpouseNameValidator(),
  makeAgesOfBoysValidator(),
  makeAgesOfGirlsValidator(),
  makeEthnicityValidator(),
  makeEmploymentStatusValidator(),
  makeIncomeLevelValidator(),
  makeSizeOfHomeValidator(),
];

export const updateStatus = [updateStatusValidator()];

