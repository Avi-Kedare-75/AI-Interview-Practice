import AgentFlowTimeline from "@/components/interview/AgentFlowTimeline";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MultiAgentPage() {
  return (
    <div className="flex flex-col gap-8 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Multi-Agent Interview</h1>
        <p className="text-muted-foreground mt-2">
          Your comprehensive evaluation panel. Context is seamlessly passed between agents.
        </p>
      </div>

      <AgentFlowTimeline />

      <div className="flex justify-end mt-4">
        <Link href="/interview/technical">
          <Button size="lg" className="gradient-bg text-white border-0 gap-2 px-8 glow-violet">
            Continue Session <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
