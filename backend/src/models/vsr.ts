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
  ethnicity: { type: [String], require: true },
  employmentStatus: { type: String, require: true },
  incomeLevel: { type: String, require: true },
  sizeOfHome: { type: String, require: true },
  address: { type: String, require: true },
  city: { type: String, require: true },
  state: { type: String, require: true },
  zipCode: { type: Number, require: true },
  phoneNumber: { type: Number, require: true },
  email: { type: String, require: true },
  militaryBranch: { type: String, require: true },
  militaryConflicts: { type: [String], require: true },
  dischargeStatus: { type: String, require: true },
  serviceConnected: { type: Boolean, require: true },
  lastRank: { type: String, require: true },
  militaryID: { type: Number, require: true },
  petInterest: { type: Boolean, require: true },
  referralSource: { type: String, require: true },
});

type VSR = InferSchemaType<typeof vsrSchema>;

export default model<VSR>("VSR", vsrSchema);
