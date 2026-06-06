"use client";

import { motion } from "motion/react";
import { Trophy, TrendingUp } from "lucide-react";
export default function ReadinessScore({ score = 0 }: { score?: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card flex flex-col items-center justify-center rounded-2xl p-6 text-center"
    >
      <h3 className="mb-6 font-semibold font-heading text-lg">
        Interview Readiness
      </h3>

      <div className="relative mb-6 flex items-center justify-center">
        {/* Background circle */}
        <svg className="h-32 w-32 -rotate-90 transform">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted"
          />
          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            className="text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-heading">{score}%</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Score
          </span>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 border-t border-border pt-4">
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="text-xs text-muted-foreground">Top 15%</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success mb-2">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="text-xs text-muted-foreground">+5% this week</span>
        </div>
      </div>
    </motion.div>
  );
}
