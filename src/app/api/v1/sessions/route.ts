import { NextRequest, NextResponse } from "next/server";
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
    
    // Get all sessions for this user, sorted by newest first
    const sessions = await InterviewSession.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error("GET /api/v1/sessions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, domain, type, resumeText, voicePreference, voice } = body;
    const resolvedVoicePreference = voicePreference ?? voice;

    if (!domain || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const newSession = await InterviewSession.create({
      userId: session.user.id,
      title: title || `${domain} Assessment`,
      domain,
      type,
      resumeText,
      voicePreference: resolvedVoicePreference,
      status: "scheduled",
    });

    return NextResponse.json({ success: true, data: newSession }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/sessions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
