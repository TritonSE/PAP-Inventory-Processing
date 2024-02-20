import { InferSchemaType, Schema, model } from "mongoose";

const vsrSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  gender: { type: String, require: true },
  age: { type: Number, require: true },
  maritalStatus: { type: String, required: true },
  spouseName: { type: String },
  agesOfBoys: { type: [Number] },
  agesOfGirls: { type: [Number] },
  ethnicity: { type: String, require: true },
  employmentStatus: { type: String, require: true },
  incomeLevel: { type: String, require: true },
  sizeOfHome: { type: String, require: true },
});

type VSR = InferSchemaType<typeof vsrSchema>;

export default model<VSR>("VSR", vsrSchema);
export type { VSR };
