"use client";

import { motion } from "motion/react";
import { discussionParticipants } from "@/data/mock";
import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

export default function ParticipationMeter() {
  // Sort participants by participation score
  const sortedParticipants = [...discussionParticipants].sort(
    (a, b) => b.participationScore - a.participationScore
  );

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Activity className="h-4 w-4" />
        </div>
        <h3 className="font-semibold font-heading">Participation Metrics</h3>
      </div>

      <div className="space-y-5">
        {sortedParticipants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className={`font-medium ${!participant.isAI ? "text-primary" : "text-foreground"}`}>
                {participant.name} {!participant.isAI && "(You)"}
              </span>
              <span className="text-muted-foreground text-xs">
                {participant.contributions} contributions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Progress
                value={participant.participationScore}
                className={`h-2 ${!participant.isAI ? "[&>div]:bg-primary" : ""}`}
              />
              <span className={`w-8 text-right text-xs font-medium ${!participant.isAI ? "text-primary" : "text-muted-foreground"}`}>
                {participant.participationScore}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
