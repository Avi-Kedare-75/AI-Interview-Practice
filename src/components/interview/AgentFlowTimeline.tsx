"use client";

import { motion } from "motion/react";
import { Check, Loader2, Clock, UserCircle2 } from "lucide-react";
import { interviewAgents } from "@/data/mock";
import { Badge } from "@/components/ui/badge";

export default function AgentFlowTimeline() {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="mb-8 border-b border-border pb-6">
        <h2 className="text-2xl font-bold font-heading">Multi-Agent Panel</h2>
        <p className="mt-2 text-muted-foreground">
          You will face a sequence of specialized AI agents. Each agent receives context from the previous rounds.
        </p>
      </div>

      <div className="relative mx-auto max-w-2xl py-4">
        {/* Main Timeline Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border sm:left-1/2 sm:-ml-px" />

        <div className="space-y-12">
          {interviewAgents.map((agent, index) => {
            const isCompleted = agent.status === "completed";
            const isActive = agent.status === "active";
            const isPending = agent.status === "pending";

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative flex items-center gap-6 ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Connector Line for completed/active states over the base line */}
                {(isCompleted || isActive) && (
                  <motion.div
                    className="absolute left-6 w-0.5 bg-primary sm:left-1/2 sm:-ml-px"
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1, delay: index * 0.5 }}
                    style={{ top: index === 0 ? "2rem" : "-3rem", bottom: isActive ? "50%" : "-3rem" }}
                  />
                )}

                {/* Agent Card */}
                <div className={`ml-16 w-full sm:ml-0 sm:w-1/2 ${index % 2 === 0 ? "sm:pr-12" : "sm:pl-12"}`}>
                  <div
                    className={`rounded-xl border p-5 transition-all ${
                      isActive
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-105 z-10 relative"
                        : isCompleted
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-card/50 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-muted border border-border">
                          {/* Fallback avatar since we don't have actual images */}
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                            <UserCircle2 className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{agent.name}</h4>
                          <p className="text-xs font-medium text-muted-foreground">{agent.role}</p>
                        </div>
                      </div>
                      
                      <Badge
                        variant={isActive ? "default" : isCompleted ? "outline" : "secondary"}
                        className={isCompleted ? "border-success text-success bg-success/10" : ""}
                      >
                        {isCompleted && "Completed"}
                        {isActive && "In Progress"}
                        {isPending && "Pending"}
                      </Badge>
                    </div>

                    {isCompleted && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {agent.duration}
                          </span>
                          <span className="text-sm font-semibold text-success">Score: {agent.score}/100</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic">&ldquo;{agent.feedback}&rdquo;</p>
                      </div>
                    )}

                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 text-sm text-primary font-medium animate-pulse">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing candidate profile...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-6 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background sm:left-1/2 shrink-0 z-20">
                  <div
                    className={`flex h-full w-full items-center justify-center rounded-full ${
                      isActive
                        ? "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                        : isCompleted
                        ? "bg-success text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
