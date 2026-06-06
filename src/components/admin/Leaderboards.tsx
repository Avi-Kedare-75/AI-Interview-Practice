"use client";

import { motion } from "motion/react";
import { Trophy, Medal } from "lucide-react";
import { leaderboardData } from "@/data/mock";

export default function Leaderboards() {
  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold font-heading">
          <Trophy className="h-5 w-5 text-warning" />
          Top Performers
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {leaderboardData.map((user, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-4 rounded-xl border border-border bg-background/50 p-3 hover:bg-accent transition-colors"
          >
            {/* Rank/Badge */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center font-bold font-heading text-lg">
              {user.badge === "gold" ? (
                <Medal className="h-7 w-7 text-yellow-500" />
              ) : user.badge === "silver" ? (
                <Medal className="h-7 w-7 text-gray-400" />
              ) : user.badge === "bronze" ? (
                <Medal className="h-7 w-7 text-amber-700" />
              ) : (
                <span className="text-muted-foreground">#{user.rank}</span>
              )}
            </div>

            {/* Avatar (Placeholder) */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {user.name.split(" ").map(n => n[0]).join("")}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="truncate font-medium text-foreground">{user.name}</h4>
              <p className="truncate text-xs text-muted-foreground">{user.domain} • {user.interviews} interviews</p>
            </div>

            {/* Score */}
            <div className="flex shrink-0 flex-col items-end">
              <span className="text-sm font-bold text-success">{user.score}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
