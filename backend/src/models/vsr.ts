import { InferSchemaType, Schema, model } from "mongoose";

const vsrSchema = new Schema({
  name: { type: String, require: true },
  gender: { type: String, require: true },
  age: { type: Number, require: true },
  maritalStatus: { type: String, require: true },
  spouseName: { type: String },
  agesOfBoys: { type: [Number] },
  agesOfGirls: { type: [Number] },
  ethnicity: { type: [String], require: true },
  employmentStatus: { type: String, require: true },
  incomeLevel: { type: String, require: true },
  sizeOfHome: { type: String, require: true },
  streetAddress: { type: String, require: true },
  city: { type: String, require: true },
  state: { type: String, require: true },
  zipCode: { type: Number, require: true },
  phoneNumber: { type: String, require: true },
  email: { type: String, require: true },
  branch: { type: [String], require: true },
  conflicts: { type: [String], require: true },
  dischargeStatus: { type: String, require: true },
  serviceConnected: { type: String, require: true },
  lastRank: { type: String, require: true },
  militaryId: { type: Number, require: true },
  petCompanion: { type: String, require: true },
  hearFrom: { type: String, require: true },
  bedroomFurnishing: { type: [String], require: true },
  bathroomFurnishing: { type: [String], require: true },
  kitchenFurnishing: { type: [String], require: true },
  livingRoomFurnishing: { type: [String], require: true },
  diningRoomFurnishing: { type: [String], require: true },
  otherFurnishing: { type: [String], require: true },
  dateReceived: { type: Date, require: true },
  lastUpdated: { type: Date, require: true },
  status: { type: String, require: true },
});

type VSR = InferSchemaType<typeof vsrSchema>;

export default model<VSR>("VSR", vsrSchema);
