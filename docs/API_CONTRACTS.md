# API CONTRACTS

This document outlines the planned REST API endpoints for Phase 3 backend integration.

## Base URL
`/api/v1`

---

## 1. Authentication
*Requires moving beyond mock data.*

### `POST /auth/register`
Creates a new candidate account.
- **Body:** `{ "email", "password", "name" }`
- **Response:** `{ "token", "user": { "id", "email", "name", "role" } }`

### `POST /auth/login`
Authenticates a user.
- **Body:** `{ "email", "password" }`
- **Response:** `{ "token", "user" }`

---

## 2. Interview Sessions

### `POST /sessions/init`
Initializes a new interview session. Used by `SetupForm`.
- **Auth:** Bearer Token
- **Body:** 
  ```json
  {
    "domain": "frontend",
    "type": "multi-agent",
    "difficulty": 75,
    "voicePreference": "v1"
  }
  ```
- **Response:** `{ "sessionId", "status": "pending", "firstAgentId" }`

### `GET /sessions/:id`
Retrieves session state, active agent, and completed questions.
- **Response:**
  ```json
  {
    "id": "uuid",
    "status": "in-progress",
    "currentAgent": { ... },
    "progress": { "current": 3, "total": 10 }
  }
  ```

---

## 3. Interview Interaction (WebSocket & REST)

*Note: For real-time voice and transcription, WebSockets or WebRTC will be used. For structured data passing, REST is used.*

### `POST /sessions/:id/question/next`
Generates the next question via LLM based on context.
- **Body:** `{ "agentId" }`
- **Response:** `{ "questionId", "text", "audioUrl", "timeLimit" }`

### `POST /sessions/:id/question/:qid/answer`
Submits candidate's answer for evaluation.
- **Body:** `{ "transcript", "codeSnapshot" }`
- **Response:** `{ "evaluation": { "score", "feedback", "isAcceptable" } }`

---

## 4. Reports & Analytics

### `GET /reports/:sessionId`
Retrieves the finalized report.
- **Response:**
  ```json
  {
    "overallScore": 88,
    "letterGrade": "A-",
    "scores": { "technical": 90, "hr": 85 },
    "strengths": ["React Hooks", "System Design"],
    "weaknesses": ["CSS Grid"],
    "roadmap": [...]
  }
  ```

### `GET /admin/stats`
Retrieves aggregated data for the admin dashboard.
- **Auth:** Admin Role
- **Response:** Returns `adminStats`, `domainDistribution`, and `leaderboardData`.
