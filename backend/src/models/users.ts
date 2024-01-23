import mongoose from "mongoose";

interface UserInterface {
  role: string;
  uid: string;
}

interface UserDoc extends mongoose.Document {
  role: string;
  uid: string;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: UserInterface): UserDoc;
}

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<UserDoc, UserModelInterface>("User", userSchema);

export { User, userSchema };
