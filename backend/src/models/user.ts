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

export enum UserRole {
  /**
   * For some reason we are getting ESLint errors about these vars not being used,
   * even though they are used in other files. Disable these ESLint errors.
   */
  // eslint-disable-next-line no-unused-vars
  STAFF = "staff",
  // eslint-disable-next-line no-unused-vars
  ADMIN = "admin",
}

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
