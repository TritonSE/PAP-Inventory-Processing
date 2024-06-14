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
exports.updateFurnitureItem = exports.deleteFurnitureItem = exports.createFurnitureItem = exports.getFurnitureItems = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const furnitureItem_1 = __importDefault(require("../models/furnitureItem"));
const validationErrorParser_1 = __importDefault(require("../util/validationErrorParser"));
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
const createFurnitureItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        (0, validationErrorParser_1.default)(errors);
        const furnitureItem = yield furnitureItem_1.default.create(req.body);
        res.status(201).json(furnitureItem);
    }
    catch (error) {
        next(error);
    }
});
exports.createFurnitureItem = createFurnitureItem;
const deleteFurnitureItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedFurnitureItem = yield furnitureItem_1.default.findByIdAndDelete(id);
        if (deletedFurnitureItem === null) {
            throw (0, http_errors_1.default)(404, "FurnitureItem not found at id " + id);
        }
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteFurnitureItem = deleteFurnitureItem;
const updateFurnitureItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        const { id } = req.params;
        (0, validationErrorParser_1.default)(errors);
        const updatedFurnitureItem = yield furnitureItem_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (updatedFurnitureItem == null) {
            throw (0, http_errors_1.default)(404, "Furniture Item not found at id " + id);
        }
        res.status(200).json(updatedFurnitureItem);
    }
    catch (error) {
        next(error);
    }
});
exports.updateFurnitureItem = updateFurnitureItem;
