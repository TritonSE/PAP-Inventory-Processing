import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
