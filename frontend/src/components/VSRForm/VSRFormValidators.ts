import emailValidator from "email-validator";
import { RegisterOptions } from "react-hook-form";
import { IVSRFormInput } from "@/components/VSRForm/VSRFormTypes";

/**
 * Defines common validators for the VSR form inputs.
 */
export const vsrInputFieldValidators: Partial<
  Record<keyof IVSRFormInput, RegisterOptions<IVSRFormInput, keyof IVSRFormInput>>
> = {
  name: { required: "Name is required" },
  gender: { required: "Gender is required" },
  age: {
    required: "Age is required",
    pattern: {
      // Only allow up to 2 digits
      value: /^[0-9]+$/,
      message: "This field must be a positive number",
    },
  },
  maritalStatus: { required: "Marital status is required" },
  spouseName: {
    required: "Spouse's Name is required",
  },
  ethnicity: { required: "Ethnicity is required" },
  employment_status: { required: "Employment status is required" },
  income_level: { required: "Income level is required" },
  size_of_home: { required: "Size of home is required" },
  streetAddress: { required: "Street address is required" },
  city: { required: "City is required" },
  state: { required: "State is required" },
  zipCode: {
    required: "Zip Code is required",
    pattern: {
      // Must be 5 digits
      value: /^\d{5}$/,
      message: "This field must be a 5 digit number",
    },
  },
  phoneNumber: {
    required: "Phone Number is required",
    pattern: {
      value: /^\d{10}$/,
      message: "This field must be a 10 digit number",
    },
  },
  email: {
    required: "Email Address is required",
    validate: {
      validate: (emailAddress) =>
        emailValidator.validate(emailAddress as string) ||
        "This field must be a valid email address",
    },
  },
  branch: { required: "Military Branch is required" },
  conflicts: { required: "Military Conflicts is required" },
  dischargeStatus: { required: "Discharge status is required" },
  serviceConnected: {
    validate: (value) =>
      [true, false].includes(value as boolean) || "Service connected is required",
  },
  lastRank: { required: "Last rank is required" },
  militaryID: {
    required: "Last rank is required",
    pattern: {
      value: /^\d{4}$/,
      message: "This field must be a 4 digit number",
    },
  },
  petCompanion: {
    validate: (value) =>
      [true, false].includes(value as boolean) || "Companionship animal is required",
  },
  hearFrom: { required: "Referral source is required" },
};
