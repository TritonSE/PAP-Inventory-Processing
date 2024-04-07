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
exports.getFurnitureItems = void 0;
const furnitureItem_1 = __importDefault(require("../models/furnitureItem"));
/**
 * Gets all available furniture items in the database. Does not require authentication.
 */
const getFurnitureItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const furnitureItems = yield furnitureItem_1.default.find().sort({
            // First, sort the items by whether they allow multiple (true before false)
            allowMultiple: -1,
            // Second, sort by category index (ascending)
            categoryIndex: 1,
        });
        res.status(200).json(furnitureItems);
    }
    catch (error) {
        next(error);
    }
});
exports.getFurnitureItems = getFurnitureItems;
