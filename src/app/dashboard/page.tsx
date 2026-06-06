import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import InterviewSession from "@/models/InterviewSession";
import type { DashboardInterviewSession } from "@/types";

import ReadinessScore from "@/components/dashboard/ReadinessScore";
import RecentInterviews from "@/components/dashboard/RecentInterviews";
import DomainProgress from "@/components/dashboard/DomainProgress";
import SkillRadarChart from "@/components/dashboard/SkillRadarChart";
import UpcomingSessions from "@/components/dashboard/UpcomingSessions";
import LearningRecommendations from "@/components/dashboard/LearningRecommendations";

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

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled");

  // Calculate readiness score
  let readinessScore = 0;
  if (completedSessions.length > 0) {
    const totalScore = completedSessions.reduce((acc, curr) => acc + (curr.score || 0), 0);
    readinessScore = Math.round(totalScore / completedSessions.length);
  }

  // Passing the plain objects to client components
  // Need to stringify/parse to avoid MongoDB ObjectId serialization errors in Server Components to Client Components
  const serializedSessions = JSON.parse(JSON.stringify(sessions)) as DashboardInterviewSession[];

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
          <ReadinessScore score={readinessScore} />
        </div>
        <div className="lg:col-span-2">
          <SkillRadarChart />
        </div>
      </div>

      {/* Middle Row: Recent Interviews + Domain Progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentInterviews interviews={serializedSessions} />
        </div>
        <div className="lg:col-span-1">
          <DomainProgress />
        </div>
      </div>

      {/* Bottom Row: Upcoming Sessions + Recommendations */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UpcomingSessions upcoming={upcomingSessions} />
        </div>
        <div className="lg:col-span-2">
          <LearningRecommendations />
        </div>
      </div>
    </div>
  );
}
