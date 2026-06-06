import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import InterviewSession from "@/models/InterviewSession";
import QuestionEvent from "@/models/QuestionEvent";
import Report from "@/models/Report";
import { generateSessionReport, QuestionHistoryItem } from "@/lib/interview-agent";
import { generateHRSessionReport, HRQuestionHistoryItem } from "@/lib/hr-interview-agent";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Verify session ownership
    const interviewSession = await InterviewSession.findOne({
      _id: id,
      userId: session.user.id,
    }).lean() as { _id: unknown; domain: string; status: string; userId: unknown } | null;

    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (interviewSession.status === "completed") {
      // Already completed — return existing report
      const existingReport = await Report.findOne({ sessionId: id }).lean() as { _id: unknown } | null;
      if (existingReport) {
        return NextResponse.json({
          success: true,
          data: { reportId: existingReport._id?.toString() },
        });
      }
    }

    // Load all question events for this session
    const questionEvents = await QuestionEvent.find({ sessionId: id })
      .sort({ createdAt: 1 })
      .lean();

    if (questionEvents.length === 0) {
      return NextResponse.json({ error: "No questions found for this session" }, { status: 400 });
    }

    // Detect session type for report generation
    const typedSession = interviewSession as {
      _id: unknown;
      domain: string;
      status: string;
      userId: unknown;
      type?: string;
    };
    const isHRSession = typedSession.type === "hr";

    // Calculate final score from all answered questions
    const answeredQuestions = questionEvents.filter(
      (q) => q.score !== undefined && q.score !== null
    );
    const finalScore =
      answeredQuestions.length > 0
        ? Math.round(
            answeredQuestions.reduce((sum, q) => sum + (q.score ?? 0), 0) /
              answeredQuestions.length
          )
        : 0;

    // Generate report via Gemini (type-specific)
    let reportData;
    if (isHRSession) {
      const hrHistory: HRQuestionHistoryItem[] = questionEvents.map((q) => ({
        questionText: q.questionText,
        candidateAnswer: q.candidateAnswer,
        score: q.score,
        category: q.agentRole,
      }));
      reportData = await generateHRSessionReport(
        interviewSession.domain,
        hrHistory,
        finalScore
      );
    } else {
      const history: QuestionHistoryItem[] = questionEvents.map((q) => ({
        questionText: q.questionText,
        candidateAnswer: q.candidateAnswer,
        score: q.score,
        topic: q.agentRole,
      }));
      reportData = await generateSessionReport(
        interviewSession.domain,
        history,
        finalScore
      );
    }

    // Save Report to DB
    const report = await Report.create({
      sessionId: id,
      userId: session.user.id,
      overallScore: reportData.overallScore,
      letterGrade: reportData.letterGrade,
      scores: reportData.scores,
      strengths: reportData.strengths,
      weaknesses: reportData.weaknesses,
      roadmap: reportData.roadmap,
    });

    // Mark session as completed
    await InterviewSession.updateOne(
      { _id: id },
      {
        $set: {
          status: "completed",
          endTime: new Date(),
          score: finalScore,
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: { reportId: report._id.toString() },
    });
  } catch (error) {
    console.error(`POST /api/v1/sessions/${id}/complete error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
