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

const makeStreetAddressValidator = () =>
  body("streetAddress")
    .exists({ checkFalsy: true })
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string");

const makeCityValidator = () =>
  body("city")
    .exists({ checkFalsy: true })
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string");

const makeStateValidator = () =>
  body("state")
    .exists({ checkFalsy: true })
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string");

const makeZipCodeValidator = () =>
  body("zipCode")
    .exists({ checkFalsy: true })
    .withMessage("Zip Code is required")
    .isInt({ min: 10000 })
    .withMessage("Zip Code must be a 5 digit integer");

const makePhoneNumberValidator = () =>
  body("phoneNumber")
    .exists({ checkFalsy: true })
    .withMessage("Phone Number is required")
    .isString()
    .withMessage("Phone number must be a string");

const makeEmailValidator = () =>
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string");

const makeBranchValidator = () =>
  body("branch")
    .exists({ checkFalsy: true })
    .withMessage("Branch is required")
    .isArray()
    .withMessage("Branch must be an array")
    .custom((branches: string[]) => branches.every((branch) => typeof branch == "string"))
    .withMessage("Each branch must be a string");

const makeConflictsValidator = () =>
  body("conflicts")
    .exists({ checkFalsy: true })
    .withMessage("Conflict(s) is required")
    .isArray()
    .withMessage("Conflict(s) must be an array")
    .custom((conflicts: string[]) => conflicts.every((conflict) => typeof conflict === "string"))
    .withMessage("Each conflict must be a string");

const makeDischargeStatusValidator = () =>
  body("dischargeStatus")
    .exists({ checkFalsy: true })
    .withMessage("Discharge Status is required")
    .isString()
    .withMessage("Discharge Status must be a string");

const makeServiceConnectedValidator = () =>
  body("serviceConnected")
    .exists({ checkFalsy: false })
    .withMessage("Service Connected is required")
    .isBoolean()
    .withMessage("Service Connected must be a boolean");

const makeLastRankValidator = () =>
  body("lastRank")
    .exists({ checkFalsy: true })
    .withMessage("Last rank is required")
    .isString()
    .withMessage("Last rank must be a string");

const makeMilitaryIDValidator = () =>
  body("militaryID")
    .exists({ checkFalsy: true })
    .withMessage("Military ID is required")
    .isInt()
    .withMessage("Military ID must be an integer");

const makePetCompanionValidator = () =>
  body("petCompanion")
    .exists({ checkFalsy: false })
    .withMessage("Pet interest is required")
    .isBoolean()
    .withMessage("Pet interest must be a boolean");

const makeHearFromValidator = () =>
  body("hearFrom")
    .exists({ checkFalsy: true })
    .withMessage("Referral source is required")
    .isString()
    .withMessage("Referral source must be a string");

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
