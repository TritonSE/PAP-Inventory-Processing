"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * A model for a furniture item that veterans can request on the VSR form.
 */
const furnitureItemSchema = new mongoose_1.Schema({
    // Category for the item (e.g. bedroom, bathroom)
    category: { type: String, required: true },
    // Name of the item (e.g. Rug, Bed)
    name: { type: String, required: true },
    // Whether to allow veterans to request multiple of the item (if true) or just 1 (if false)
    allowMultiple: { type: Boolean, required: true },
    // Index of the item within its category, used to display items in a deterministic order on the VSR form
    categoryIndex: { type: Number, required: true },
});
exports.default = (0, mongoose_1.model)("FurnitureItem", furnitureItemSchema);
