import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import InterviewSession from "@/models/InterviewSession";

const GD_AGENTS = [
  { id: "agent-1", name: "Sarah (Product)", role: "Product Manager" },
  { id: "agent-2", name: "Mike (Engineering)", role: "Tech Lead" },
  { id: "agent-3", name: "David (Design)", role: "UX Designer" },
  { id: "agent-4", name: "Lisa (Data)", role: "Data Scientist" },
  { id: "agent-5", name: "Alex (Marketing)", role: "Marketing Director" },
];

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const interviewSession = await InterviewSession.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!interviewSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const topic = interviewSession.domain === "frontend" 
      ? "Should we migrate our monolithic React application to a Micro-Frontend architecture?"
      : "How do we balance rapid feature delivery with accumulating technical debt?";

    // Generate initial introduction messages
    const responses = [
      {
        id: Math.random().toString(36).substring(7),
        agentId: "system",
        senderName: "Moderator",
        text: `Welcome to the Group Discussion. Today's topic is: "${topic}". We have 5 participants and you. Sarah, please start us off.`,
      },
      {
        id: Math.random().toString(36).substring(7),
        agentId: "agent-1",
        senderName: "Sarah (Product)",
        text: `Thanks. From a product perspective, I believe we need to carefully weigh the benefits of this. What does everyone else think?`,
      }
    ];

    return NextResponse.json({ 
      success: true, 
      data: {
        topic,
        participants: GD_AGENTS,
        responses
      } 
    });

  } catch (error: any) {
    console.error("GD Init Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
