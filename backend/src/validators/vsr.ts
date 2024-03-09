import { body } from "express-validator";

// name: {type: String, required: true },
//     date: {type: Date, required: true},
//     gender: {type: String, require: true},
//     age: {type: Number, require: true},
//     martialStatus: {type: String, required: true },
//     spouseName: {type: String},
//     numOfBoys: {type: Number},
//     numOfGirls: {type: Number},
//     agesOfBoys: {type: [Number] },
//     agesOfGirls: {type: [Number] },
//     ethnicity: {type: String, require: true},
//     employmentStatus: {type: String, require: true},
//     incomeLevel: {type: String, require: true},
//     sizeOfHome: {type: String, require: true}

const makeNameValidator = () =>
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string");

const makeDateValidator = () =>
  body("date")
    .exists({ checkFalsy: true })
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in ISO 8601 format");

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

const makeNumOfBoysValidator = () =>
  body("numOfBoys")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Number of Boys must be a positive integer");

const makeAgesOfGirlsValidator = () =>
  body("agesOfGirls")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("Ages of Girls must be an array of numbers")
    .custom((ages: number[]) => ages.every((age) => Number.isInteger(age) && age >= 0))
    .withMessage("Each age in Ages of Girls must be a positive integer");

const makeEthnicityValidator = () =>
  body("ethnicity")
    .exists({ checkFalsy: true })
    .withMessage("Ethnicity is required")
    .isString()
    .withMessage("Ethnicity must be a string");

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

const makeStatusValidator = () =>
  body("status")
    .exists({ checkFalsy: true })
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string");

const makeLastUpdatedValidator = () =>
  body("lastUpdated")
    .exists({ checkFalsy: true })
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in ISO 8601 format");

const makeCaseIdValidator = () =>
  body("caseId")
    .exists({ checkFalsy: true })
    .withMessage("Case Id is required")
    .isString()
    .withMessage("Case Id must be a string");

const makeHearFromValidator = () =>
  body("hearFrom")
    .exists({ checkFalsy: true })
    .withMessage("Hear from is required")
    .isString()
    .withMessage("Hear from must be a string");

const makePetCompanionValidator = () =>
  body("petCompanion")
    .exists({ checkFalsy: true })
    .withMessage("Pet companion is required")
    .isBoolean()
    .withMessage("Pet companion must be a boolean");

const makeMilitaryIdValidator = () =>
  body("militaryId")
    .exists({ checkFalsy: true })
    .withMessage("Military Id is required")
    .isInt()
    .withMessage("Military Id must be an integer");

const makeLastRankValidator = () =>
  body("lastRank")
    .exists({ checkFalsy: true })
    .withMessage("Last rank is required")
    .isString()
    .withMessage("Last rank must be a string");

const makeServiceConnectedValidator = () =>
  body("serviceConnected")
    .exists({ checkFalsy: true })
    .withMessage("Service connected is required")
    .isBoolean()
    .withMessage("Service connected must be a boolean");

const makeDischargeStatusValidator = () =>
  body("dischargeStatus")
    .exists({ checkFalsy: true })
    .withMessage("Discharge status is required")
    .isString()
    .withMessage("Discharge status must be a string");

const makeEmailValidator = () =>
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string");

const makePhoneNumberValidator = () =>
  body("phoneNumber")
    .exists({ checkFalsy: true })
    .withMessage("Phone number is required")
    .isString()
    .withMessage("Phone number must be a string");

const makeZipCodeValidator = () =>
  body("zipCode")
    .exists({ checkFalsy: true })
    .withMessage("Zip code is required")
    .isInt({ min: 0 })
    .withMessage("Zip code must be a positive integer");

const makeStateValidator = () =>
  body("state")
    .exists({ checkFalsy: true })
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string");

const makeCityValidator = () =>
  body("city")
    .exists({ checkFalsy: true })
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string");

const makeStreetAddressValidator = () =>
  body("streetAddress")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required")
    .isString()
    .withMessage("Street address must be a string");

const makeNumOfGirlsValidator = () =>
  body("numOfGirls")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Number of Girls must be a positive integer");

export const createVSR = [
  makeNameValidator(),
  makeDateValidator(),
  makeGenderValidator(),
  makeAgeValidator(),
  makeMaritalStatusValidator(),
  makeSpouseNameValidator(),
  makeNumOfBoysValidator(),
  makeAgesOfGirlsValidator(),
  makeEthnicityValidator(),
  makeEmploymentStatusValidator(),
  makeIncomeLevelValidator(),
  makeSizeOfHomeValidator(),
  makeStatusValidator(),
  makeLastUpdatedValidator(),
  makeCaseIdValidator(),
  makeHearFromValidator(),
  makePetCompanionValidator(),
  makeMilitaryIdValidator(),
  makeLastRankValidator(),
  makeServiceConnectedValidator(),
  makeDischargeStatusValidator(),
  makeEmailValidator(),
  makePhoneNumberValidator(),
  makeZipCodeValidator(),
  makeStateValidator(),
  makeCityValidator(),
  makeStreetAddressValidator(),
  makeNumOfBoysValidator(),
  makeNumOfGirlsValidator(),
];
