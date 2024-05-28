import { ObjectId } from "mongodb";
import { InferSchemaType, Schema, model } from "mongoose";

/**
 * A model for a user of our application.
 */
const userSchema = new Schema({
  // The user's role (either staff or admin)
  role: {
    type: String,
    required: true,
  },

  // The user's Firebase UID (used to relate the MongoDB user to the Firebas user)
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

export interface DisplayUser {
  _id: ObjectId;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
