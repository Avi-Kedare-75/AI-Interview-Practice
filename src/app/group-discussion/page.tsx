import DiscussionArena from "@/components/group-discussion/DiscussionArena";
import ParticipationMeter from "@/components/group-discussion/ParticipationMeter";
import ChatPanel from "@/components/interview/ChatPanel";
import VoicePanel from "@/components/interview/VoicePanel";
import { discussionTopic } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { LogOut, Users } from "lucide-react";
import Link from "next/link";

export default function GroupDiscussionPage() {
  return (
    <div className="flex h-[calc(100vh-130px)] flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between glass-card rounded-xl p-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-heading tracking-tight">{discussionTopic.title}</h1>
            <p className="text-xs text-muted-foreground">{discussionTopic.category} • {discussionTopic.duration}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Link href="/dashboard">
            <Button variant="destructive" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" /> End Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden pr-2 lg:pr-0">
        {/* Left Column: GD Arena & Topic */}
        <div className="flex flex-col gap-6 lg:col-span-8 min-h-0">
          <div className="glass-card rounded-2xl p-4 text-sm text-foreground border-primary/20 bg-primary/5">
            <span className="font-semibold text-primary">Topic: </span>
            {discussionTopic.description}
          </div>
          <div className="flex-1 min-h-[400px]">
            <DiscussionArena />
          </div>
        </div>

        {/* Right Column: Chat, Voice, & Metrics */}
        <div className="flex flex-col gap-6 lg:col-span-4 min-h-[800px] lg:min-h-0">
          <div className="shrink-0">
            <ParticipationMeter />
          </div>
          <div className="flex-1 min-h-[300px]">
            <ChatPanel />
          </div>
          <div className="shrink-0">
            <VoicePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
