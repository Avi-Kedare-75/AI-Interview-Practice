# SYSTEM ARCHITECTURE

## Current Architecture (Phase 1)
In Phase 1, the architecture is entirely client-side, acting as a presentation layer.
- **Framework**: Next.js App Router (React Server Components + Client Components).
- **Routing**: File-system based routing via `src/app`.
- **State Management**: React `useState` and `useEffect` at the component level.
- **Data Layer**: Static JSON objects served from `src/data/mock.ts`. No external fetching.
- **Styling**: Tailwind CSS compiling static utility classes.
- **Deployment Strategy**: Can be exported statically or run via Vercel Edge/Serverless functions (currently run locally via `next dev --turbopack`).

## Future Architecture (Phases 2-13)
The system will evolve into a robust, decoupled microservices or modular monolith architecture.

### 1. Frontend Layer
- Continues to use Next.js.
- Will integrate with state management (Zustand/Redux) for complex interview sessions.
- Socket.io-client for real-time bidirectional communication during group discussions and live coding.

### 2. Backend Layer (Node.js/Express)
- **API Gateway/Server**: Express.js handling REST APIs and WebSocket connections.
- **Service Layer**: Business logic for interview flow, report generation, and analytics.
- **AI Orchestration Layer**: Manages context passing between different LLM agents (Technical, HR, Manager).

### 3. Data Layer
- **Relational DB**: PostgreSQL managed by Prisma ORM for structured data (Users, Sessions, Reports).
- **Cache/PubSub**: Redis (optional, for WebSocket scaling and session caching).
- **Blob Storage**: Cloudinary for storing user avatars, resume PDFs, and interview audio recordings.

### 4. AI & Voice Integrations
- **LLM Providers**: OpenAI (GPT-4o), Anthropic (Claude 3.5 Sonnet), or Google (Gemini) via SDKs for generating questions, evaluating answers, and simulating personas.
- **Voice Synthesis**: ElevenLabs API for generating lifelike interviewer audio.
- **Speech-to-Text**: Web Speech API (Client-side) or Whisper API (Server-side) for transcribing candidate answers.

### 5. Execution Environment (Coding)
- Isolated Docker containers or services like JDoodle/Piston API to safely execute candidate code in various languages.

## Service Boundaries
1. **Auth Service**: Manages JWTs, OAuth, user sessions.
2. **Interview Service**: Orchestrates the state machine of an interview (Setup -> Question -> Answer -> Evaluate -> Next).
3. **Agent Deliberation Service**: A specialized background worker that takes transcripts from all agents and synthesizes the final report.
4. **Analytics Service**: Aggregates data for the Admin and Recruiter dashboards.
