# DEVELOPER HANDOFF

## Welcome to HireMind AI
This project has successfully completed Phase 1 (UI Foundation). The repository is primed for full-stack integration.

## Getting Started
1. **Prerequisites**: Node.js 18+, npm/pnpm.
2. **Install dependencies**: `npm install`
3. **Run Dev Server**: `npm run dev` (Uses Turbopack for extremely fast HMR).
4. **Build**: `npm run build`

## Strict Rules for Continuing Developers
If you are an AI model or human developer taking over this project, you MUST adhere to the following constraints established in Phase 1:

1. **Incremental Development**: Do NOT skip phases. Only implement the features specified in the current active phase as defined in `PHASE_PROGRESS.md`.
2. **Type Safety**: The project uses strict TypeScript. Do not use `any`. All interfaces must be defined in `src/types/index.ts` or closely coupled to the component if highly specific.
3. **UI Consistency**: Maintain the established design language. Use the CSS variables defined in `src/app/globals.css`. Rely on `glass-card` classes for primary containers.
4. **Mock Data Migration**: When moving to Phase 3 (Backend), slowly replace the arrays in `src/data/mock.ts` with SWR/React Query fetch hooks connected to real endpoints.
5. **Component Modularity**: Never build massive monolothic components. Split logic and presentation.

## Core Dependencies Installed
- Next.js 15 (React 19 RC)
- Tailwind CSS v4
- Motion (`motion/react`)
- Recharts
- Lucide React
- Radix UI Primitives (via ShadCN)

## Documentation Index
Before writing code, review:
- `PROJECT_CONTEXT.md` - Overall vision and UI scope.
- `SYSTEM_ARCHITECTURE.md` - Client/Server boundaries and future LLM integration strategy.
- `DATABASE_SCHEMA.md` - The Prisma blueprint.
- `API_CONTRACTS.md` - The expected REST endpoints.

## Immediate Next Steps (Phase 2 & 3)
1. Set up a PostgreSQL database.
2. Initialize Prisma (`npx prisma init`) and copy the schema from `DATABASE_SCHEMA.md`.
3. Set up Auth (NextAuth or external provider).
4. Create the first set of `GET` routes to replace the dashboard mock data.
