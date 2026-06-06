"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { candidateReport } from "@/data/mock";
import { Code, Users, MessageSquare, Briefcase, BrainCircuit, Users2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const categoryConfig = [
  { key: "technical", label: "Technical Skills", icon: Code, color: "bg-primary" },
  { key: "hr", label: "Cultural Fit (HR)", icon: Briefcase, color: "bg-success" },
  { key: "communication", label: "Communication", icon: MessageSquare, color: "bg-cyan-500" },
  { key: "leadership", label: "Leadership", icon: Users, color: "bg-orange-500" },
  { key: "problemSolving", label: "Problem Solving", icon: BrainCircuit, color: "bg-violet-500" },
  { key: "teamwork", label: "Team Collaboration", icon: Users2, color: "bg-pink-500" },
];

const progressStyle: CSSProperties & Record<"--progress-background", string> = {
  "--progress-background": "var(--color-muted)",
};

interface CategoryScoresProps {
  scores?: Record<string, number>;
}

export default function CategoryScores({ scores: propScores }: CategoryScoresProps) {
  const scores = (propScores || candidateReport.scores) as Record<string, number>;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-6 text-lg font-semibold font-heading border-b border-border pb-4">
        Detailed Breakdown
      </h3>

      <div className="grid gap-6 sm:grid-cols-2">
        {categoryConfig.map((cat, index) => {
          const score = scores[cat.key] ?? 0;
          const Icon = cat.icon;

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
                <span className="text-sm font-bold">{score}%</span>
              </div>
              <Progress 
                value={score} 
                className="h-2"
                style={progressStyle}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
