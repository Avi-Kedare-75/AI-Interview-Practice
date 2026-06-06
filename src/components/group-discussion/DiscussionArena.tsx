"use client";

import { motion } from "motion/react";
import { User, Bot, Mic } from "lucide-react";
import { discussionParticipants } from "@/data/mock";

export default function DiscussionArena() {
  return (
    <div className="glass-card relative flex h-[500px] w-full flex-col items-center justify-center rounded-2xl p-8 overflow-hidden">
      {/* Background ripples */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="h-48 w-48 rounded-full border border-primary/30 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute h-96 w-96 rounded-full border border-primary/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]" />
      </div>

      <div className="relative h-80 w-80 max-w-full">
        {discussionParticipants.map((participant, index) => {
          const total = discussionParticipants.length;
          const angle = (index * (360 / total)) * (Math.PI / 180);
          
          // Calculate positions in a circle
          const radius = 140;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <div className="group relative flex flex-col items-center">
                <div
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all ${
                    participant.isSpeaking
                      ? "border-primary bg-primary/20 scale-110 shadow-[0_0_20px_rgba(139,92,246,0.4)] z-20 animate-speaking"
                      : "border-border bg-card/80 hover:border-primary/50 z-10"
                  }`}
                >
                  {participant.isSpeaking && (
                    <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1 text-white shadow-md">
                      <Mic className="h-3 w-3" />
                    </div>
                  )}
                  {participant.isAI ? (
                    <Bot className={`h-8 w-8 ${participant.isSpeaking ? "text-primary" : "text-muted-foreground"}`} />
                  ) : (
                    <User className={`h-8 w-8 ${participant.isSpeaking ? "text-primary" : "text-foreground"}`} />
                  )}
                </div>

                {/* Nametag */}
                <div className={`mt-2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium backdrop-blur-md ${
                  participant.isSpeaking ? "bg-primary text-white" : "bg-background/80 text-foreground border border-border"
                }`}>
                  {participant.name}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Center element (e.g. topic icon or timer) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-md shadow-inner">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Time Left</span>
          <span className="text-xl font-bold font-mono text-primary mt-1">24:15</span>
        </div>
      </div>
    </div>
  );
}
