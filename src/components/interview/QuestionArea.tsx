"use client";

import { motion } from "motion/react";
import { BookOpen, AlertCircle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DifficultyLevel } from "@/types";

interface QuestionAreaProps {
  question?: string;
  difficulty?: DifficultyLevel;
  topic?: string;
  domain?: string;
  isLoading?: boolean;
  hints?: string[];
}

// Fallback mock data (used when no props are passed — Phase 1 compatibility)
const FALLBACK = {
  question: "Explain the concept of virtual DOM in React and how it improves performance compared to direct DOM manipulation.",
  difficulty: "intermediate" as DifficultyLevel,
  topic: "React Core",
  domain: "Frontend",
  hints: [],
};

export default function QuestionArea({
  question = FALLBACK.question,
  difficulty = FALLBACK.difficulty,
  topic = FALLBACK.topic,
  domain = FALLBACK.domain,
  isLoading = false,
  hints = [],
}: QuestionAreaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 md:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold font-heading text-lg">Current Question</h3>
            <p className="text-xs text-muted-foreground">{domain} • {topic}</p>
          </div>
        </div>
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

      {/* Hints */}
      {hints.length > 0 && !isLoading && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Lightbulb className="h-3.5 w-3.5 text-warning" />
            Hints
          </div>
          {hints.map((hint, i) => (
            <p key={i} className="text-sm text-muted-foreground pl-5 border-l-2 border-warning/30">
              {hint}
            </p>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        <AlertCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
        <p>
          Take a moment to structure your thoughts. The AI interviewer is looking for a comprehensive answer
          covering the mechanics, trade-offs, and practical implications.
        </p>
      </div>
    </motion.div>
  );
}
