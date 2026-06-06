import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import InterviewSession from "@/models/InterviewSession";
import Report from "@/models/Report";
import type { DashboardInterviewSession } from "@/types";

import ReadinessScore from "@/components/dashboard/ReadinessScore";
import RecentInterviews from "@/components/dashboard/RecentInterviews";
import DomainProgress from "@/components/dashboard/DomainProgress";
import SkillRadarChart from "@/components/dashboard/SkillRadarChart";
import UpcomingSessions from "@/components/dashboard/UpcomingSessions";
import LearningRecommendations from "@/components/dashboard/LearningRecommendations";

// ─── Dummy fallback data so the dashboard never looks empty ────────────────
const DUMMY_SESSIONS: DashboardInterviewSession[] = [
  {
    _id: "demo-1",
    userId: "demo",
    domain: "frontend",
    type: "technical",
    difficulty: 60,
    status: "completed",
    score: 78,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString() as any,
  },
  {
    _id: "demo-2",
    userId: "demo",
    domain: "backend",
    type: "hr",
    difficulty: 50,
    status: "completed",
    score: 85,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString() as any,
  },
  {
    _id: "demo-3",
    userId: "demo",
    domain: "fullstack",
    type: "technical",
    difficulty: 70,
    status: "completed",
    score: 62,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString() as any,
  },
  {
    _id: "demo-4",
    userId: "demo",
    domain: "frontend",
    type: "group-discussion",
    difficulty: 50,
    status: "scheduled",
    score: 0,
    createdAt: new Date(Date.now() + 86400000).toISOString() as any,
  },
];

const DUMMY_RADAR = [
  { skill: "Technical", score: 78 },
  { skill: "Communication", score: 72 },
  { skill: "Problem Solving", score: 68 },
  { skill: "HR/Behavioral", score: 85 },
  { skill: "Leadership", score: 60 },
  { skill: "Teamwork", score: 74 },
];

const DUMMY_DOMAIN = [
  { id: "d-0", domain: "Frontend", progress: 60, completedQuestions: 3, totalQuestions: 5 },
  { id: "d-1", domain: "Backend", progress: 40, completedQuestions: 2, totalQuestions: 5 },
  { id: "d-2", domain: "Fullstack", progress: 20, completedQuestions: 1, totalQuestions: 5 },
];

const DUMMY_RECOMMENDATIONS = [
  { id: "r-0", title: "Master React Hooks", description: "Deep-dive into useEffect, useMemo, and custom hooks.", priority: "high" as const, estimatedTime: "Week 1", category: "Technical" },
  { id: "r-1", title: "System Design Basics", description: "Practice designing scalable distributed systems.", priority: "medium" as const, estimatedTime: "Week 2", category: "Architecture" },
  { id: "r-2", title: "Behavioral Interview Prep", description: "Structure STAR-format answers for leadership questions.", priority: "medium" as const, estimatedTime: "Week 3", category: "Soft Skills" },
];

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  await dbConnect();

  // Fetch all sessions for this user
  const sessions = await InterviewSession.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean<DashboardInterviewSession[]>();

  const hasRealData = sessions.length > 0;

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled");

  // Calculate readiness score
  let readinessScore = 0;
  if (completedSessions.length > 0) {
    const totalScore = completedSessions.reduce((acc, curr) => acc + (curr.score || 0), 0);
    readinessScore = Math.round(totalScore / completedSessions.length);
  }

  // Fetch Reports for completed sessions
  const sessionIds = completedSessions.map(s => s._id);
  const reports = await Report.find({ sessionId: { $in: sessionIds } }).lean() as any[];

  // Aggregate Radar Data
  let aggScores = { technical: 0, communication: 0, problemSolving: 0, hr: 0, leadership: 0, teamwork: 0 };
  if (reports.length > 0) {
    reports.forEach(r => {
      aggScores.technical += r.scores?.technical || 0;
      aggScores.communication += r.scores?.communication || 0;
      aggScores.problemSolving += r.scores?.problemSolving || 0;
      aggScores.hr += r.scores?.hr || 0;
      aggScores.leadership += r.scores?.leadership || 0;
      aggScores.teamwork += r.scores?.teamwork || 0;
    });
    Object.keys(aggScores).forEach(k => {
      aggScores[k as keyof typeof aggScores] = Math.round(aggScores[k as keyof typeof aggScores] / reports.length);
    });
  }
  const radarData = hasRealData ? [
    { skill: "Technical", score: aggScores.technical || 65 },
    { skill: "Communication", score: aggScores.communication || 65 },
    { skill: "Problem Solving", score: aggScores.problemSolving || 65 },
    { skill: "HR/Behavioral", score: aggScores.hr || 65 },
    { skill: "Leadership", score: aggScores.leadership || 65 },
    { skill: "Teamwork", score: aggScores.teamwork || 65 },
  ] : DUMMY_RADAR;

  // Aggregate Domain Progress
  const domainMap: Record<string, number> = {};
  completedSessions.forEach(s => {
    domainMap[s.domain] = (domainMap[s.domain] || 0) + 1;
  });
  const domainData = Object.keys(domainMap).length > 0
    ? Object.keys(domainMap).map((domain, i) => ({
        id: `domain-${i}`,
        domain: domain.charAt(0).toUpperCase() + domain.slice(1),
        progress: Math.min(100, Math.round((domainMap[domain] / 5) * 100)),
        completedQuestions: domainMap[domain],
        totalQuestions: 5
      }))
    : DUMMY_DOMAIN;

  // Aggregate Recommendations
  const allRoadmap = reports.flatMap(r => r.roadmap || []);
  const recommendationsData = allRoadmap.length > 0
    ? allRoadmap.slice(0, 3).map((r, i) => ({
        id: `rec-${i}`,
        title: r.title,
        description: r.description,
        priority: i === 0 ? "high" as const : "medium" as const,
        estimatedTime: `Week ${r.week}`,
        category: r.category
      }))
    : DUMMY_RECOMMENDATIONS;

  // Passing the plain objects to client components
  const serializedSessions = hasRealData
    ? JSON.parse(JSON.stringify(sessions)) as DashboardInterviewSession[]
    : DUMMY_SESSIONS;

  const displayUpcoming = upcomingSessions.length > 0
    ? upcomingSessions
    : DUMMY_SESSIONS.filter(s => s.status === "scheduled");

  const displayReadiness = hasRealData ? readinessScore : 75;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Welcome back, {session.user.name?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-2">
          Track your interview readiness, recent performance, and upcoming sessions.
        </p>
      </div>

      {/* Top Row: Readiness Score + Skill Radar */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReadinessScore score={displayReadiness} />
        </div>
        <div className="lg:col-span-2">
          <SkillRadarChart data={radarData} />
        </div>
      </div>

      {/* Middle Row: Recent Interviews + Domain Progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentInterviews interviews={serializedSessions} />
        </div>
        <div className="lg:col-span-1">
          <DomainProgress data={domainData} />
        </div>
      </div>

      {/* Bottom Row: Upcoming Sessions + Recommendations */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UpcomingSessions upcoming={displayUpcoming} />
        </div>
        <div className="lg:col-span-2">
          <LearningRecommendations data={recommendationsData} />
        </div>
      </div>
    </div>
  );
}
