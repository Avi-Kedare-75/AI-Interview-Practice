import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import InterviewSession from "@/models/InterviewSession";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { sessionId } = await context.params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Verify session belongs to the user
    const interviewSession = await InterviewSession.findOne({
      _id: sessionId,
      userId: session.user.id,
    }).lean();

    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Find the report
    const report = await Report.findOne({ sessionId }).lean();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error(`GET /api/v1/reports/${sessionId} error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
