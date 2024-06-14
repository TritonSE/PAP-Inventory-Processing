"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfirmationEmail = void 0;
const express_validator_1 = require("express-validator");
const html_validator_1 = __importDefault(require("html-validator"));
const makeHTMLValidator = () => (0, express_validator_1.body)("html")
    .exists({ checkFalsy: true })
    .withMessage("HTML is required")
    .isString()
    .withMessage("HTML must be a string")
    .custom((html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, html_validator_1.default)({ data: html });
        return true;
    }
    catch (error) {
        return false;
    }
}));
exports.updateConfirmationEmail = [makeHTMLValidator()];
