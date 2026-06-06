"use client";

import { motion } from "motion/react";
import { candidateReport } from "@/data/mock";
import { Trophy, Award } from "lucide-react";

interface ScoreOverviewProps {
  report?: {
    overallScore: number;
    letterGrade: string;
  };
}

export default function ScoreOverview({ report }: ScoreOverviewProps) {
  const { overallScore, letterGrade } = report || candidateReport;
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8 justify-between">
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-bold font-heading">Performance Overview</h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive analysis based on live interview evaluation
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Top Percentile</p>
              <p className="font-semibold text-foreground">
                {overallScore >= 80 ? "Top 12%" : overallScore >= 60 ? "Top 35%" : "Top 65%"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hire Recommendation</p>
              <p className="font-semibold text-foreground">
                {overallScore >= 80 ? "Strong Yes" : overallScore >= 60 ? "Yes" : "Needs Review"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center justify-center shrink-0"
      >
        <svg className="h-40 w-40 -rotate-90 transform">
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-muted"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            className="text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-heading">{overallScore}</span>
          <span className="text-sm font-semibold text-primary">{letterGrade} Grade</span>
        </div>
      </motion.div>
    </div>
  );
}
