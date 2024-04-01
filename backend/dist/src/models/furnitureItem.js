"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const furnitureItemSchema = new mongoose_1.Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    allowMultiple: { type: Boolean, required: true },
    categoryIndex: { type: Number, required: true },
});
exports.default = (0, mongoose_1.model)("FurnitureItem", furnitureItemSchema);
