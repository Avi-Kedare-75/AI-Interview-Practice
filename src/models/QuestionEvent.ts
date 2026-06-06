import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionEvent extends Document {
  sessionId: mongoose.Types.ObjectId;
  agentRole: string;
  questionText: string;
  candidateAnswer?: string;
  score?: number;
  feedback?: string;
  timeLimit: number;
  timeTaken?: number;
  createdAt: Date;
}

const QuestionEventSchema: Schema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "InterviewSession", required: true },
    agentRole: { type: String, required: true },
    questionText: { type: String, required: true },
    candidateAnswer: { type: String },
    score: { type: Number },
    feedback: { type: String },
    timeLimit: { type: Number, required: true },
    timeTaken: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.QuestionEvent ||
  mongoose.model<IQuestionEvent>("QuestionEvent", QuestionEventSchema);
