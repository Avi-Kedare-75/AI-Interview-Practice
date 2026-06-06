import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import InterviewSession from "@/models/InterviewSession";
import QuestionEvent from "@/models/QuestionEvent";
import {
  generateFirstHRQuestion,
  generateNextHRQuestion,
  HRQuestionHistoryItem,
} from "@/lib/hr-interview-agent";

type RouteContext = { params: Promise<{ id: string }> };

const TOTAL_HR_QUESTIONS = 8;

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Load the interview session
    const interviewSession = await InterviewSession.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Load question history for this session
    const existingQuestions = await QuestionEvent.find({ sessionId: id })
      .sort({ createdAt: 1 })
      .lean();

    // Check if session is already complete
    if (existingQuestions.length >= TOTAL_HR_QUESTIONS) {
      return NextResponse.json(
        { error: "Session complete. No more questions.", sessionComplete: true },
        { status: 400 }
      );
    }

    // Calculate running score from answered questions
    const answeredQuestions = existingQuestions.filter(
      (q) => q.score !== undefined && q.score !== null
    );
    const runningScore =
      answeredQuestions.length > 0
        ? Math.round(
            answeredQuestions.reduce((sum, q) => sum + (q.score ?? 0), 0) /
              answeredQuestions.length
          )
        : 50; // Default starting score

    // Build history for context
    const history: HRQuestionHistoryItem[] = existingQuestions.map((q) => ({
      questionText: q.questionText,
      candidateAnswer: q.candidateAnswer,
      score: q.score,
      category: q.agentRole, // agentRole stores the category for HR
    }));

    const typedSession = interviewSession as {
      domain: string;
      difficulty?: number;
      resumeText?: string;
    };

    // Generate question via Gemini (HR-specific)
    let generated;
    if (existingQuestions.length === 0) {
      generated = await generateFirstHRQuestion(
        typedSession.domain,
        typedSession.difficulty ?? 50,
        typedSession.resumeText
      );
    } else {
      generated = await generateNextHRQuestion(
        typedSession.domain,
        typedSession.difficulty ?? 50,
        history,
        runningScore
      );
    }

    // Save the new QuestionEvent to DB (answer/score filled in later)
    const newQuestion = await QuestionEvent.create({
      sessionId: id,
      agentRole: generated.category, // reuse agentRole field as category
      questionText: generated.text,
      timeLimit: generated.timeLimit,
    });

    // Update session status to in-progress if it was scheduled
    await InterviewSession.updateOne(
      { _id: id, status: "scheduled" },
      { $set: { status: "in-progress", startTime: new Date() } }
    );

    return NextResponse.json({
      success: true,
      data: {
        questionId: newQuestion._id.toString(),
        text: generated.text,
        category: generated.category,
        difficulty: generated.difficulty,
        timeLimit: generated.timeLimit,
        starPrompt: generated.starPrompt,
        questionNumber: existingQuestions.length + 1,
        totalQuestions: TOTAL_HR_QUESTIONS,
      },
    });
  } catch (error) {
    console.error(`POST /api/v1/sessions/${id}/hr-question/next error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
