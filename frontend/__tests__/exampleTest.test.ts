import "@testing-library/jest-dom";

import {
  isnum,
  validateAge,
  validateEthnicityOther,
  validateSpouseName,
} from "../src/util/validateResponses";

describe("Frontend Validator Tests", () => {
  describe("IsNum", () => {
    it("Correctly classifies '0' as a number", () => {
      expect(isnum("0")).toEqual(true);
    });

    it("Correctly classifies various numbers as numbers", () => {
      expect(isnum("1")).toEqual(true);
      expect(isnum("2")).toEqual(true);
      expect(isnum("3")).toEqual(true);
      expect(isnum("23948")).toEqual(true);
      expect(isnum("56")).toEqual(true);
    });

    it("Correctly classifies various non-numbers as non-numbers", () => {
      expect(isnum("")).toEqual(false);
      expect(isnum(" ")).toEqual(false);
      expect(isnum("abc")).toEqual(false);
      expect(isnum("a")).toEqual(false);
      expect(isnum("32 049")).toEqual(false);
      expect(isnum("32,049")).toEqual(false);
      expect(isnum("32.049")).toEqual(false);
      expect(isnum("32-049")).toEqual(false);
      expect(isnum("32/049")).toEqual(false);
      expect(isnum("-5")).toEqual(false);
    });
  });

  describe("ValidateAge", () => {
    it("Correctly classifies valid ages", () => {
      expect(validateAge("0")).toEqual("Success");
      expect(validateAge("1")).toEqual("Success");
      expect(validateAge("2")).toEqual("Success");
      expect(validateAge("50")).toEqual("Success");
    });

    it("Correctly classifies invalid ages", () => {
      expect(validateAge("")).toEqual("Age is not a number");
      expect(validateAge("five years old")).toEqual("Age is not a number");
      expect(validateAge("abc")).toEqual("Age is not a number");
      expect(validateAge("a")).toEqual("Age is not a number");
      expect(validateAge("-5")).toEqual("Age is not a number");
    });
  });

  describe("ValidateSpouseName", () => {
    it("Correctly classifies married and has spouse name", () => {
      expect(validateSpouseName("Married", "Bob")).toEqual("Success");
      expect(validateSpouseName("Married", "Bob Smith")).toEqual("Success");
      expect(validateSpouseName("Married", "Bob Smith Jr.")).toEqual("Success");
    });

    it("Correctly classifies married and has no spouse name", () => {
      expect(validateSpouseName("Married", "")).toEqual("Spouse name is required");
    });

    it("Correctly classifies single and has spouse name", () => {
      expect(validateSpouseName("Single", "Bob")).toEqual("Spouse name is not required");
      expect(validateSpouseName("Single", "Bob Smith")).toEqual("Spouse name is not required");
      expect(validateSpouseName("Single", "Bob Smith Jr.")).toEqual("Spouse name is not required");
    });

    it("Correctly classifies single and has no spouse name", () => {
      expect(validateSpouseName("Single", "")).toEqual("Success");
    });

    it("Correctly classifies is complicated", () => {
      expect(validateSpouseName("It's Complicated", "")).toEqual("Success");
      expect(validateSpouseName("It's Complicated", "Bob")).toEqual("Success");
      expect(validateSpouseName("It's Complicated", "Bob Smith")).toEqual("Success");
    });
  });

  describe("ValidateEthnicityOther", () => {
    it("Correctly classifies no ethnicity and no other", () => {
      expect(validateEthnicityOther("", "")).toEqual("Please fill out the other field");
    });

    it("Correctly classifies no ethnicity and other", () => {
      expect(validateEthnicityOther("", "Other")).toEqual("Success");
      expect(validateEthnicityOther("", "Polynesian")).toEqual("Success");
    });

    it("Correctly classifies has ethnicity and has other", () => {
      expect(validateEthnicityOther("Asian", "Other")).toEqual(
        "Please leave the other field empty",
      );
      expect(validateEthnicityOther("Asian", "Polynesian")).toEqual(
        "Please leave the other field empty",
      );
    });

    it("Correctly classifies ethnicity, no other", () => {
      expect(validateEthnicityOther("Asian", "")).toEqual("Success");
      expect(validateEthnicityOther("Hispanic", "")).toEqual("Success");
      expect(validateEthnicityOther("Not Given", "")).toEqual("Success");
    });
  });
});
