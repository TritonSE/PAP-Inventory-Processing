"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVSR = exports.updateStatus = exports.createVSR = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validators for creating and updating VSRs
 */
const makeNameValidator = () => (0, express_validator_1.body)("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string");
const makeGenderValidator = () => (0, express_validator_1.body)("gender")
    .exists({ checkFalsy: true })
    .withMessage("Gender is required")
    .isString()
    .withMessage("Gender must be a string");
const makeAgeValidator = () => (0, express_validator_1.body)("age")
    .exists({ checkFalsy: true })
    .withMessage("Age is required")
    .isInt({ min: 0 })
    .withMessage("Age must be a positive integer");
const makeMaritalStatusValidator = () => (0, express_validator_1.body)("maritalStatus")
    .exists({ checkFalsy: true })
    .withMessage("Marital Status is required")
    .isString()
    .withMessage("Marital Status must be a string");
const makeSpouseNameValidator = () => (0, express_validator_1.body)("spouseName")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Spouse Name must be a string");
const makeAgesOfBoysValidator = () => (0, express_validator_1.body)("agesOfBoys")
    .exists({ checkFalsy: true })
    .isArray()
    .withMessage("Ages of Boys must be an array of numbers")
    .custom((ages) => ages.every((age) => Number.isInteger(age) && age >= 0))
    .withMessage("Each age in Ages of Boys must be a positive integer");
const makeAgesOfGirlsValidator = () => (0, express_validator_1.body)("agesOfGirls")
    .exists({ checkFalsy: true })
    .isArray()
    .withMessage("Ages of Girls must be an array of numbers")
    .custom((ages) => ages.every((age) => Number.isInteger(age) && age >= 0))
    .withMessage("Each age in Ages of Girls must be a positive integer");
const makeEthnicityValidator = () => (0, express_validator_1.body)("ethnicity")
    .exists({ checkFalsy: true })
    .withMessage("Ethnicity is required")
    .isArray()
    .withMessage("Ethnicity must be an array")
    .custom((ethnicities) => ethnicities.every((ethnicity) => typeof ethnicity === "string"))
    .withMessage("Each ethnicity in Ethnicities must be a string");
const makeEmploymentStatusValidator = () => (0, express_validator_1.body)("employmentStatus")
    .exists({ checkFalsy: true })
    .withMessage("Employment Status is required")
    .isString()
    .withMessage("Employment Status must be a string");
const makeIncomeLevelValidator = () => (0, express_validator_1.body)("incomeLevel")
    .exists({ checkFalsy: true })
    .withMessage("Income Level is required")
    .isString()
    .withMessage("Income Level must be a string");
const makeSizeOfHomeValidator = () => (0, express_validator_1.body)("sizeOfHome")
    .exists({ checkFalsy: true })
    .withMessage("Size of Home is required")
    .isString()
    .withMessage("Size of Home must be a string");
const makeStreetAddressValidator = () => (0, express_validator_1.body)("streetAddress")
    .exists({ checkFalsy: true })
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string");
const makeCityValidator = () => (0, express_validator_1.body)("city")
    .exists({ checkFalsy: true })
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string");
const makeStateValidator = () => (0, express_validator_1.body)("state")
    .exists({ checkFalsy: true })
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string");
const makeZipCodeValidator = () => (0, express_validator_1.body)("zipCode")
    .exists({ checkFalsy: true })
    .withMessage("Zip Code is required")
    .isInt({ min: 10000 })
    .withMessage("Zip Code must be a 5 digit integer");
const makePhoneNumberValidator = () => (0, express_validator_1.body)("phoneNumber")
    .exists({ checkFalsy: true })
    .withMessage("Phone Number is required")
    .isString()
    .withMessage("Phone number must be a string");
const makeEmailValidator = () => (0, express_validator_1.body)("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string");
const makeBranchValidator = () => (0, express_validator_1.body)("branch")
    .exists({ checkFalsy: true })
    .withMessage("Branch is required")
    .isArray()
    .withMessage("Branch must be an array")
    .custom((branches) => branches.every((branch) => typeof branch == "string"))
    .withMessage("Each branch must be a string");
const makeConflictsValidator = () => (0, express_validator_1.body)("conflicts")
    .exists({ checkFalsy: true })
    .withMessage("Conflict(s) is required")
    .isArray()
    .withMessage("Conflict(s) must be an array")
    .custom((conflicts) => conflicts.every((conflict) => typeof conflict === "string"))
    .withMessage("Each conflict must be a string");
const makeDischargeStatusValidator = () => (0, express_validator_1.body)("dischargeStatus")
    .exists({ checkFalsy: true })
    .withMessage("Discharge Status is required")
    .isString()
    .withMessage("Discharge Status must be a string");
const makeServiceConnectedValidator = () => (0, express_validator_1.body)("serviceConnected")
    .exists({ checkFalsy: false })
    .withMessage("Service Connected is required")
    .isBoolean()
    .withMessage("Service Connected must be a boolean");
const makeLastRankValidator = () => (0, express_validator_1.body)("lastRank")
    .exists({ checkFalsy: true })
    .withMessage("Last rank is required")
    .isString()
    .withMessage("Last rank must be a string");
const makeMilitaryIDValidator = () => (0, express_validator_1.body)("militaryID")
    .exists({ checkFalsy: true })
    .withMessage("Military ID is required")
    .isInt()
    .withMessage("Military ID must be an integer");
const makePetCompanionValidator = () => (0, express_validator_1.body)("petCompanion")
    .exists({ checkFalsy: false })
    .withMessage("Pet interest is required")
    .isBoolean()
    .withMessage("Pet interest must be a boolean");
const makeHearFromValidator = () => (0, express_validator_1.body)("hearFrom")
    .exists({ checkFalsy: true })
    .withMessage("Referral source is required")
    .isString()
    .withMessage("Referral source must be a string");
const ALLOWED_STATUSES = [
    "Received",
    "Appointment Scheduled",
    "Approved",
    "Resubmit",
    "No-show / Incomplete",
    "Archived",
];
const updateStatusValidator = () => (0, express_validator_1.body)("status")
    .exists({ checkFalsy: true })
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string")
    .isIn(ALLOWED_STATUSES)
    .withMessage("Status must be one of the allowed options");
exports.createVSR = [
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
    makeStreetAddressValidator(),
    makeCityValidator(),
    makeStateValidator(),
    makeZipCodeValidator(),
    makePhoneNumberValidator(),
    makeEmailValidator(),
    makeBranchValidator(),
    makeConflictsValidator(),
    makeDischargeStatusValidator(),
    makeServiceConnectedValidator(),
    makeLastRankValidator(),
    makeMilitaryIDValidator(),
    makePetCompanionValidator(),
    makeHearFromValidator(),
];
exports.updateStatus = [updateStatusValidator()];
exports.updateVSR = [
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
