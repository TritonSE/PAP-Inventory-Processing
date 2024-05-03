import { InferSchemaType, Schema, model } from "mongoose";

/**
 * A model for a furniture item that veterans can request on the VSR form.
 */
const furnitureItemSchema = new Schema({
  // Category for the item (e.g. bedroom, bathroom)
  category: { type: String, required: true },

  // Name of the item (e.g. Rug, Bed)
  name: { type: String, required: true },

  // Whether to allow veterans to request multiple of the item (if true) or just 1 (if false)
  allowMultiple: { type: Boolean, required: true },

  // Index of the item within its category, used to display items in a deterministic order on the VSR form
  categoryIndex: { type: Number, required: true },
});

export type FurnitureItem = InferSchemaType<typeof furnitureItemSchema>;

export default model<FurnitureItem>("FurnitureItem", furnitureItemSchema);
