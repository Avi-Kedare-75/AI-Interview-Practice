"use client";

import { motion } from "motion/react";
import {
  Users,
  AlertCircle,
  Lightbulb,
  Shield,
  Heart,
  Handshake,
  RefreshCw,
  MessageSquare,
  Briefcase,
  Puzzle,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DifficultyLevel } from "@/types";

interface HRQuestionAreaProps {
  question?: string;
  category?: string;
  difficulty?: DifficultyLevel;
  isLoading?: boolean;
  starPrompt?: string;
}

// Category-specific icon and color mapping
const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bgColor: string; borderColor: string }
> = {
  "Conflict Resolution": {
    icon: Shield,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  Leadership: {
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  Teamwork: {
    icon: Handshake,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  Adaptability: {
    icon: RefreshCw,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  Communication: {
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  "Work Ethic": {
    icon: Briefcase,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  "Problem Solving": {
    icon: Puzzle,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  "Culture Fit": {
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
};

const DEFAULT_CONFIG = {
  icon: Users,
  color: "text-orange-500",
  bgColor: "bg-orange-500/10",
  borderColor: "border-orange-500/20",
};

// Fallback mock data (used when no props are passed — Phase 1 compatibility)
const FALLBACK = {
  question:
    "Tell me about a time when you had a significant disagreement with a team member or a manager about a technical decision. How did you handle the situation, and what was the outcome?",
  category: "Conflict Resolution",
  difficulty: "intermediate" as DifficultyLevel,
  starPrompt: "",
};

export default function HRQuestionArea({
  question = FALLBACK.question,
  category = FALLBACK.category,
  difficulty = FALLBACK.difficulty,
  isLoading = false,
  starPrompt = "",
}: HRQuestionAreaProps) {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card rounded-2xl p-6 md:p-8 ${config.borderColor} shadow-[0_8px_30px_rgb(249,115,22,0.05)]`}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bgColor} ${config.color}`}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold font-heading text-lg">Behavioral Question</h3>
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`capitalize
              ${difficulty === "beginner" ? "border-success/50 text-success bg-success/10" : ""}
              ${difficulty === "intermediate" ? "border-warning/50 text-warning bg-warning/10" : ""}
              ${difficulty === "advanced" ? "border-orange-500/50 text-orange-500 bg-orange-500/10" : ""}
              ${difficulty === "expert" ? "border-destructive/50 text-destructive bg-destructive/10" : ""}
            `}
          >
            {difficulty}
          </Badge>
          <Badge
            variant="outline"
            className={`${config.borderColor.replace("border-", "border-").replace("/20", "/50")} ${config.color} ${config.bgColor}`}
          >
            STAR Method Recommended
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-5 bg-muted/60 rounded-full w-full" />
          <div className="h-5 bg-muted/60 rounded-full w-5/6" />
          <div className="h-5 bg-muted/40 rounded-full w-3/4" />
        </div>
      ) : (
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="prose prose-sm dark:prose-invert max-w-none"
        >
          <p className="text-lg leading-relaxed font-medium text-foreground">{question}</p>
        </motion.div>
      )}

      {/* STAR Method Prompt */}
      {starPrompt && !isLoading && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Lightbulb className="h-3.5 w-3.5 text-warning" />
            STAR Method Guide
          </div>
          <p className="text-sm text-muted-foreground pl-5 border-l-2 border-warning/30">
            {starPrompt}
          </p>
        </div>
      )}

      <div
        className={`mt-8 flex items-start gap-3 rounded-xl border ${config.borderColor} ${config.bgColor.replace("/10", "/5")} p-4 text-sm text-muted-foreground`}
      >
        <AlertCircle className={`h-5 w-5 shrink-0 ${config.color} mt-0.5`} />
        <p>
          Focus on your communication style, your ability to compromise, and how you prioritize the
          project&apos;s success over personal opinions. Use specific examples from your experience.
        </p>
      </div>
    </motion.div>
  );
}
