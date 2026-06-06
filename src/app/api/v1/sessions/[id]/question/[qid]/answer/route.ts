import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import InterviewSession from "@/models/InterviewSession";
import QuestionEvent from "@/models/QuestionEvent";
import { evaluateAnswer } from "@/lib/interview-agent";
import type { DifficultyLevel } from "@/types";

type RouteContext = { params: Promise<{ id: string; qid: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const { id, qid } = await context.params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { transcript, timeTaken } = body as {
      transcript: string;
      timeTaken?: number;
    };

    await dbConnect();

    // Verify session ownership
    const interviewSession = await InterviewSession.findOne({
      _id: id,
      userId: session.user.id,
    }).lean() as { domain: string; difficulty?: number } | null;

    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Load the specific question
    const questionEvent = await QuestionEvent.findOne({
      _id: qid,
      sessionId: id,
    });

    if (!questionEvent) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Prevent double-submission
    if (questionEvent.candidateAnswer !== undefined && questionEvent.candidateAnswer !== null) {
      return NextResponse.json(
        { error: "Answer already submitted for this question" },
        { status: 409 }
      );
    }

    // Map difficulty number to label
    const difficultyValue = interviewSession.difficulty ?? 50;
    const difficultyLabel: DifficultyLevel =
      difficultyValue <= 25 ? "beginner" :
      difficultyValue <= 50 ? "intermediate" :
      difficultyValue <= 75 ? "advanced" : "expert";

    // Evaluate with Gemini
    const evaluation = await evaluateAnswer(
      questionEvent.questionText,
      transcript || "",
      interviewSession.domain,
      difficultyLabel
    );

    // Update the QuestionEvent
    questionEvent.candidateAnswer = transcript || "";
    questionEvent.score = evaluation.score;
    questionEvent.feedback = evaluation.feedback;
    questionEvent.timeTaken = timeTaken ?? null;
    await questionEvent.save();

    // Recalculate running average score for the session
    const allAnswered = await QuestionEvent.find({
      sessionId: id,
      score: { $ne: null },
    }).lean();

    const avgScore =
      allAnswered.length > 0
        ? Math.round(
            allAnswered.reduce((sum, q) => sum + (q.score ?? 0), 0) / allAnswered.length
          )
        : 0;

    // Update session running score
    await InterviewSession.updateOne({ _id: id }, { $set: { score: avgScore } });

    return NextResponse.json({
      success: true,
      data: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        isAcceptable: evaluation.isAcceptable,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        runningScore: avgScore,
      },
    });
  } catch (error) {
    console.error(`POST /api/v1/sessions/${id}/question/${qid}/answer error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
