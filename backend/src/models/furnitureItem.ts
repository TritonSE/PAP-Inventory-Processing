import { InferSchemaType, Schema, model } from "mongoose";

const furnitureItemSchema = new Schema({
  _id: { type: String, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  allowMultiple: { type: Boolean, required: true },
  categoryIndex: { type: Number, required: true },
});

type FurnitureItem = InferSchemaType<typeof furnitureItemSchema>;

export default model<FurnitureItem>("FurnitureItem", furnitureItemSchema);
