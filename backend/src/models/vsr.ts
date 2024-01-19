import { InferSchemaType, Schema, model } from "mongoose";

const vsrSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  gender: { type: String, require: true },
  age: { type: Number, require: true },
  martialStatus: { type: String, required: true },
  spouseName: { type: String },
  numOfBoys: { type: Number },
  numOfGirls: { type: Number },
  agesOfBoys: { type: [Number] },
  agesOfGirls: { type: [Number] },
  ethnicity: { type: String, require: true },
  employmentStatus: { type: String, require: true },
  incomeLevel: { type: String, require: true },
  sizeOfHome: { type: String, require: true },
});
