# DATABASE SCHEMA

This schema represents the planned relational database structure (PostgreSQL) for Phase 3 onwards.

## Prisma Schema Representation

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// User Management
// ==========================================

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  passwordHash  String?   // Optional if using OAuth exclusively
  role          Role      @default(CANDIDATE)
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  profile       CandidateProfile?
  sessions      InterviewSession[]
}

enum Role {
  CANDIDATE
  RECRUITER
  ADMIN
}

model CandidateProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  readinessScore  Float    @default(0)
  resumeUrl       String?
  skills          String[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ==========================================
// Interview Core
// ==========================================

model InterviewSession {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  domain      String   // e.g., "frontend", "backend"
  type        InterviewType
  difficulty  Int      // 1-100
  status      SessionStatus @default(SCHEDULED)
  startTime   DateTime?
  endTime     DateTime?
  score       Float?
  feedback    String?
  
  questions   QuestionEvent[]
  agents      AgentSession[]
  report      Report?
  
  createdAt   DateTime @default(now())
}

enum InterviewType {
  TECHNICAL
  HR
  MULTI_AGENT
  GROUP_DISCUSSION
}

enum SessionStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// ==========================================
// Multi-Agent Flow Tracking
// ==========================================

model AgentSession {
  id           String   @id @default(uuid())
  sessionId    String
  session      InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  agentId      String   // e.g., "tech-lead", "hr-manager"
  order        Int      // Execution order
  status       SessionStatus
  transcript   String?  @db.Text
  agentScore   Float?
  agentNotes   String?  @db.Text
  
  createdAt    DateTime @default(now())
}

model QuestionEvent {
  id           String   @id @default(uuid())
  sessionId    String
  session      InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  agentId      String?  // Null if single agent
  questionText String   @db.Text
  answerText   String?  @db.Text
  audioUrl     String?
  score        Float?
  feedback     String?  @db.Text
  timeTaken    Int?     // Seconds
  
  createdAt    DateTime @default(now())
}

// ==========================================
// Analytics & Reporting
// ==========================================

model Report {
  id           String   @id @default(uuid())
  sessionId    String   @unique
  session      InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  overallScore Float
  letterGrade  String
  strengths    String[]
  weaknesses   String[]
  roadmap      Json     // Array of actionable items
  isFlagged    Boolean  @default(false)
  
  createdAt    DateTime @default(now())
}
```
