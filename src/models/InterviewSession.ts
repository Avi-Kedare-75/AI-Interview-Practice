import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewSession extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  domain: string;
  type: "technical" | "hr" | "multi-agent" | "group-discussion";
  voicePreference?: string;
  status: "scheduled" | "in-progress" | "completed";
  startTime?: Date;
  endTime?: Date;
  score?: number;
  duration?: string;
  resumeText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    domain: { type: String, required: true },
    type: {
      type: String,
      enum: ["technical", "hr", "multi-agent", "group-discussion"],
      required: true,
    },
    voicePreference: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed"],
      default: "in-progress",
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    score: { type: Number },
    duration: { type: String },
    resumeText: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.InterviewSession ||
  mongoose.model<IInterviewSession>("InterviewSession", InterviewSessionSchema);
