import { InferSchemaType, Schema, model } from "mongoose";

/**
 * A model for the confirmation email sent to veterans when they fill out the
 * VSR. Only one instance of this model will ever exist at once.
 */
const confirmationEmailSchema = new Schema({
  // The HTML of the email
  html: { type: String, required: true },
});

export type ConfirmationEmail = InferSchemaType<typeof confirmationEmailSchema>;

export default model<ConfirmationEmail>("ConfirmationEmail", confirmationEmailSchema);
