import { InferSchemaType, Schema, model } from "mongoose";

const vsrSchema = new Schema({
  name: { type: String, required: true },
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
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  branch: { type: [String], required: true },
  conflicts: { type: [String], required: true },
  dischargeStatus: { type: String, required: true },
  serviceConnected: { type: String, required: true },
  lastRank: { type: String, required: true },
  militaryId: { type: Number, required: true },
  petCompanion: { type: String, required: true },
  hearFrom: { type: String, required: true },
  bedroomFurnishing: { type: [String], required: true },
  bathroomFurnishing: { type: [String], required: true },
  kitchenFurnishing: { type: [String], required: true },
  livingRoomFurnishing: { type: [String], required: true },
  diningRoomFurnishing: { type: [String], required: true },
  otherFurnishing: { type: [String], required: true },
  dateReceived: { type: Date, required: true },
  lastUpdated: { type: Date, required: true },
  status: { type: String, required: true },
});

type VSR = InferSchemaType<typeof vsrSchema>;

export default model<VSR>("VSR", vsrSchema);
