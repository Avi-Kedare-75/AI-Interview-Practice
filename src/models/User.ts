import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  name: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  isEmailVerified: boolean;
  avatarUrl?: string;
  defaultResumeText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["CANDIDATE", "RECRUITER", "ADMIN"],
      default: "CANDIDATE",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
    },
    defaultResumeText: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
