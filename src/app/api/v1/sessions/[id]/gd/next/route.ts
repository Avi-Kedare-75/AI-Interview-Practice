import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const GD_AGENTS = [
  { id: "agent-1", name: "Sarah (Product)", role: "Product Manager" },
  { id: "agent-2", name: "Mike (Engineering)", role: "Tech Lead" },
  { id: "agent-3", name: "David (Design)", role: "UX Designer" },
  { id: "agent-4", name: "Lisa (Data)", role: "Data Scientist" },
  { id: "agent-5", name: "Alex (Marketing)", role: "Marketing Director" },
];

const DUMMY_RESPONSES = [
  "I think we need to focus on user experience first. If it's not intuitive, they won't use it.",
  "From an engineering perspective, we need to ensure the architecture can scale before we worry about the UI.",
  "I agree with Mike. But we can't ignore accessibility standards either.",
  "Let's look at the data. Our analytics show users drop off at the onboarding step.",
  "If we market this as a premium feature, we can justify the extra development time.",
  "That's a great point. How do we measure the success of this initiative?",
  "We should implement A/B testing to see which approach yields better engagement.",
  "I'm concerned about technical debt if we rush this out."
];

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { chatHistory } = body; 

    if (!chatHistory || !Array.isArray(chatHistory)) {
      return NextResponse.json({ error: "Invalid chat history" }, { status: 400 });
    }

    // Pick a deterministic dummy response based on history length
    const nextResponseText = DUMMY_RESPONSES[chatHistory.length % DUMMY_RESPONSES.length];
    
    // Pick an agent who hasn't spoken in the last 2 turns if possible
    const recentSenders = chatHistory.slice(-2).map((m: any) => m.senderName);
    const availableAgents = GD_AGENTS.filter(a => !recentSenders.includes(a.name));
    const nextAgent = availableAgents.length > 0 
      ? availableAgents[chatHistory.length % availableAgents.length] 
      : GD_AGENTS[chatHistory.length % GD_AGENTS.length];

    // Artificial delay to simulate "thinking"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newResponses = [{
      id: Math.random().toString(36).substring(7),
      agentId: nextAgent.id,
      senderName: nextAgent.name,
      text: nextResponseText
    }];

    return NextResponse.json({ success: true, data: { responses: newResponses } });

  } catch (error: any) {
    console.error("GD Next Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
