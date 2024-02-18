import { InferSchemaType, Schema, model } from "mongoose";

const furnitureItemSchema = new Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  isGasElectric: { type: Boolean, required: true },
  allowMultiple: { type: Boolean, required: true },
  categoryIndex: { type: Number, required: true },
});

type furnitureItem = InferSchemaType<typeof furnitureItemSchema>;

export default model<furnitureItem>("FurnitureItem", furnitureItemSchema);
