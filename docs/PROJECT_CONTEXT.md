# PROJECT CONTEXT

## Project Vision
HireMind AI is a multi-agent AI interview and assessment ecosystem. It aims to provide candidates with a highly realistic, intelligent hiring preparation platform where multiple AI interviewers conduct sequential interviews, evaluate candidates, simulate group discussions, assess coding skills, analyze communication abilities, and generate recruiter-grade reports.

## Current Phase: Phase 6 (Completed)
**Phase 6: HR AI Interview Agent**
The objective was to build a live, AI-powered HR/behavioral interview agent that generates adaptive behavioral/situational questions, evaluates candidate answers using the STAR method, provides real-time confidence and stress analysis, and generates HR-specific reports.

## Completed Features
- **Landing Page**: Hero, Features, Statistics, Testimonials, How It Works, Pricing, FAQ.
- **Candidate Dashboard**: Readiness Score, Recent Interviews, Domain Progress, Skill Radar Chart, Upcoming Sessions, Learning Recommendations.
- **Interview Setup**: Multi-step wizard to select domain, difficulty, type, and voice preferences.
- **Technical Interview Screen**: Split view containing Chat Panel, Voice Panel, Question Area, Timer, Progress Bar, and Scratchpad Notes.
- **HR Interview Screen**: Live, AI-powered HR interview with real-time emotion/confidence indicator, STAR method guidance, and behavioral question generation.
- **Multi-Agent Interview Flow**: Vertical timeline showing the sequential flow between Technical Expert, HR Expert, Team Lead, and Hiring Manager.
- **AI Group Discussion Arena**: Circular layout visualizing 5 AI participants and the candidate with dynamic speaking indicators and participation metrics.
- **Candidate Report**: Comprehensive evaluation dashboard with overall scores, category breakdowns, strengths/weaknesses, and a learning roadmap.
- **Admin Dashboard**: Platform analytics, user growth charts, domain distributions, leaderboards, and a reports data table.
- **Authentication & Database System**: Login, Signup, OAuth, JWT, MongoDB integration with Mongoose.
- **Resume Intelligence Engine**: Resume text parsing and adaptive interview personalization.
- **Technical AI Interview Agent**: Adaptive Gemini-powered question generation, SpeechRecognition voice answers, automatic evaluation scoring, and learning roadmap generation.
- **HR AI Interview Agent**: Real-time behavioral/situational adaptive question generation, evaluation for communication, confidence, and STAR method, dynamic emotion progress bars, and HR evaluation report generation.

## Pending Features (Future Phases)
- Phase 7: Sequential Multi-Agent Interview System (Context passing between agents)
- Phase 8: AI Panel Deliberation Engine (Collaborative final verdicts)
- Phase 9: Coding Assessment Engine (Monaco Editor, Execution, AI Code Review)
- Phase 10: AI Group Discussion Arena (Real-time multi-agent interactions)
- Phase 11: Learning Roadmap Generator
- Phase 12: Analytics & Recruiter Dashboard
- Phase 13: Production Readiness (Testing, CI/CD, Monitoring)

## Folder Structure
```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── admin/
│   ├── dashboard/
│   ├── group-discussion/
│   ├── interview/
│   ├── report/
│   ├── globals.css       # Global styles and design tokens
│   └── layout.tsx        # Root layout with theme providers
├── components/           # Reusable UI components
│   ├── admin/
│   ├── dashboard/
│   ├── group-discussion/
│   ├── interview/
│   ├── landing/
│   ├── layout/
│   ├── providers/
│   ├── report/
│   └── ui/               # ShadCN UI primitive components
├── data/                 # Mock data layer
│   └── mock.ts
├── lib/                  # Utilities and constants
│   ├── constants.ts
│   └── utils.ts
└── types/                # Global TypeScript definitions
    └── index.ts
```

## Component Inventory
Over 50 components were built. Key components include:
- `Navbar`, `Sidebar`, `Footer`, `PageTransition`
- `ReadinessScore`, `SkillRadarChart`, `UpcomingSessions`, `DomainProgress`
- `SetupForm`, `ChatPanel`, `VoicePanel`, `QuestionArea`, `AgentFlowTimeline`
- `DiscussionArena`, `ParticipationMeter`
- `ScoreOverview`, `StrengthWeakness`, `LearningRoadmap`
- `UserAnalytics`, `Leaderboards`, `ReportsTable`

## UI & Theme Decisions
- **Framework**: Next.js 15+ (App Router), React 19.
- **Styling**: Tailwind CSS v4, utilizing `@theme inline` for custom tokens.
- **Design Language**: Glassmorphism (`glass-card` utilities), dark-first aesthetic, vibrant gradient accents (Electric Violet & Cyan).
- **Typography**: Inter (Body), Space Grotesk (Headings), Geist Mono (Code/Timers).
- **Animations**: `motion` (formerly framer-motion) for page transitions, hover lifts, staggered lists, and complex SVG path animations (e.g., circular progress, radar charts).
- **Data Viz**: `recharts` for highly customizable, responsive charts.
