import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import InterviewSession from "@/models/InterviewSession";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch all sessions for this user
    const sessions = await InterviewSession.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const completedSessions = sessions.filter(s => s.status === "completed");
    const upcomingSessions = sessions.filter(s => s.status === "scheduled");

    // Calculate a naive readiness score based on average score of completed sessions
    let readinessScore = 0;
    if (completedSessions.length > 0) {
      const totalScore = completedSessions.reduce((acc, curr) => acc + (curr.score || 0), 0);
      readinessScore = Math.round(totalScore / completedSessions.length);
    }

    // Process Domain Progress
    const domainMap = new Map();
    completedSessions.forEach((s) => {
      if (!domainMap.has(s.domain)) {
        domainMap.set(s.domain, { domain: s.domain, completedQuestions: 0, totalQuestions: 10 }); // Mocking questions count for now
      }
      const entry = domainMap.get(s.domain);
      entry.completedQuestions += 5; // Simulating 5 questions per session
      entry.progress = Math.min(100, Math.round((entry.completedQuestions / entry.totalQuestions) * 100));
    });
    const domainProgressData = Array.from(domainMap.values());

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          readinessScore,
          interviewsCompleted: completedSessions.length,
        },
        recentInterviews: sessions.slice(0, 5), // Top 5 recent
        upcomingSessions: upcomingSessions.slice(0, 3), // Next 3 upcoming
        domainProgressData: domainProgressData.length > 0 ? domainProgressData : [],
      }
    });
  } catch (error) {
    console.error("GET /api/v1/user/dashboard error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
