import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationToken extends Document {
  email: string;
  otp: string;
  expires: Date;
  createdAt: Date;
}

const VerificationTokenSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
      index: { expires: "0" }, // Automatically delete document when expiration time is reached
    },
  },
  { timestamps: true }
);

export default mongoose.models.VerificationToken || 
  mongoose.model<IVerificationToken>("VerificationToken", VerificationTokenSchema);
