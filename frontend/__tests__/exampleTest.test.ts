import "@testing-library/jest-dom";

import { isnum, validateAge } from "../src/util/validateResponses";

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
});
