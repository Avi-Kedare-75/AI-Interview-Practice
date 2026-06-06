import type { DefaultSession } from "next-auth";

// ============================================================================
// HireMind AI — Type Definitions
// Phase 1: UI Foundation (Mock Data Types)
// ============================================================================

// --- Common ---
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// --- Landing Page ---
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
}

// --- Dashboard ---
export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  readinessScore: number;
  interviewsCompleted: number;
  joinedAt: string;
}

export interface RecentInterview {
  id: string;
  title: string;
  domain: string;
  type: InterviewType;
  status: InterviewStatus;
  score: number | null;
  date: string;
  duration: string;
}

export type InterviewType =
  | "technical"
  | "hr"
  | "multi-agent"
  | "group-discussion"
  | "coding";

export type InterviewStatus =
  | "completed"
  | "in-progress"
  | "scheduled"
  | "cancelled";

export type UserRole = "CANDIDATE" | "RECRUITER" | "ADMIN";

export interface DomainProgress {
  id: string;
  domain: string;
  progress: number;
  totalQuestions: number;
  completedQuestions: number;
}

export interface SkillScore {
  skill: string;
  score: number;
  fullMark: number;
}

export interface UpcomingSession {
  id: string;
  title: string;
  type: InterviewType;
  date: string;
  time: string;
  domain: string;
}

export interface DashboardInterviewSession {
  _id?: string;
  title: string;
  domain: string;
  type: InterviewType;
  status: InterviewStatus;
  score?: number | null;
  duration?: string;
  createdAt?: string | Date;
  date?: string | Date;
  startTime?: string | Date;
  endTime?: string | Date;
}

export interface LearningRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
}

// --- Interview Setup ---
export interface InterviewDomain {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionsCount: number;
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface VoicePreference {
  id: string;
  name: string;
  accent: string;
  gender: string;
  preview: string;
}

// --- Interview Screen ---
export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  content: string;
  timestamp: string;
  agentName?: string;
  agentRole?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  difficulty: DifficultyLevel;
  topic: string;
  domain: string;
  timeLimit: number;
}

// --- Phase 5: Live Technical Interview ---
export interface LiveQuestion {
  questionId: string;
  text: string;
  topic: string;
  difficulty: DifficultyLevel;
  timeLimit: number;
  hints: string[];
  questionNumber: number;
  totalQuestions: number;
}

export interface LiveAnswerEvaluation {
  score: number;        // 0–100
  feedback: string;
  isAcceptable: boolean;
  strengths: string[];
  improvements: string[];
  runningScore: number;
}

export type InterviewState =
  | "idle"
  | "loading_question"
  | "answering"
  | "submitting_answer"
  | "showing_feedback"
  | "session_complete";

// --- Phase 6: Live HR Interview ---
export interface LiveHRQuestion {
  questionId: string;
  text: string;
  category: string;       // e.g., "Leadership", "Conflict Resolution"
  difficulty: DifficultyLevel;
  timeLimit: number;
  starPrompt: string;     // STAR method guidance for this question
  questionNumber: number;
  totalQuestions: number;
}

export interface HRAnswerEvaluation {
  score: number;           // 0–100
  feedback: string;
  isAcceptable: boolean;
  strengths: string[];
  improvements: string[];
  confidenceScore: number; // 0–100 (AI-inferred)
  communicationScore: number; // 0–100
  runningScore: number;
}

// --- Multi-Agent Flow ---
export interface InterviewAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "completed" | "active" | "pending";
  score: number | null;
  feedback: string | null;
  duration: string | null;
}

// --- Group Discussion ---
export interface DiscussionParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isAI: boolean;
  isSpeaking: boolean;
  participationScore: number;
  contributions: number;
}

export interface DiscussionTopic {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
}

// --- Report ---
export interface CandidateReport {
  id: string;
  candidateName: string;
  date: string;
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
  roadmap: RoadmapItem[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  week: number;
  completed: boolean;
  category: string;
}

// --- Admin ---
export interface AdminStats {
  totalUsers: number;
  totalInterviews: number;
  activeUsers: number;
  avgScore: number;
  growthRate: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface DomainDistribution {
  domain: string;
  count: number;
  percentage: number;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  interviews: number;
  domain: string;
  badge: "gold" | "silver" | "bronze" | null;
}

export interface AdminReport {
  id: string;
  candidateName: string;
  date: string;
  type: InterviewType;
  score: number;
  status: "reviewed" | "pending" | "flagged";
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: UserRole;
    };
  }

  interface User {
    role?: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
