import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  overallScore: number;
  letterGrade: string;
  scores: {
    technical: number;
    hr: number;
    communication: number;
    leadership: number;
    problemSolving: number;
    teamwork: number;
  };
  strengths: string[];
  weaknesses: string[];
  roadmap: Array<{
    title: string;
    description: string;
    week: number;
    category: string;
    completed: boolean;
  }>;
  createdAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "InterviewSession", required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    overallScore: { type: Number, required: true },
    letterGrade: { type: String, required: true },
    scores: {
      technical: { type: Number },
      hr: { type: Number },
      communication: { type: Number },
      leadership: { type: Number },
      problemSolving: { type: Number },
      teamwork: { type: Number },
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    roadmap: [
      {
        title: { type: String },
        description: { type: String },
        week: { type: Number },
        category: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
