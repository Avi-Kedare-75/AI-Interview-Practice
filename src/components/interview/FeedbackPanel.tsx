"use client";

import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackPanelProps {
  score: number;
  feedback: string;
  isAcceptable: boolean;
  strengths: string[];
  improvements: string[];
  onNext: () => void;
  isLastQuestion: boolean;
  isLoadingNext: boolean;
  confidenceScore?: number;
  communicationScore?: number;
}

export default function FeedbackPanel({
  score,
  feedback,
  isAcceptable,
  strengths = [],
  improvements = [],
  onNext,
  isLastQuestion,
  isLoadingNext,
  confidenceScore,
  communicationScore,
}: FeedbackPanelProps) {
  // Determine color theme based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-success border-success bg-success/10";
    if (s >= 50) return "text-warning border-warning bg-warning/10";
    return "text-destructive border-destructive bg-destructive/10";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto border border-primary/20 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold font-heading text-lg">Evaluation Result</h3>
            <p className="text-xs text-muted-foreground">AI Immediate Feedback</p>
          </div>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono font-bold text-lg ${getScoreColor(
            score
          )}`}
        >
          {score}
        </div>
      </div>

      {(confidenceScore !== undefined || communicationScore !== undefined) && (
        <div className="flex flex-wrap items-center gap-6 bg-muted/30 rounded-xl p-3 border border-border/40 text-xs justify-center sm:justify-start">
          {confidenceScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">AI-Inferred Confidence:</span>
              <span className="font-bold text-emerald-500 text-sm">{confidenceScore}%</span>
            </div>
          )}
          {communicationScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Communication Quality:</span>
              <span className="font-bold text-violet-500 text-sm">{communicationScore}%</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Interviewer Feedback
          </h4>
          <p className="text-foreground leading-relaxed text-sm md:text-base">{feedback}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Strengths */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-success uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Key Strengths
            </h5>
            {strengths.length > 0 ? (
              <ul className="space-y-1.5">
                {strengths.map((str, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-muted-foreground pl-2 border-l border-success/30">
                    {str}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground italic">None noted.</p>
            )}
          </div>

          {/* Improvements */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-warning uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Suggested Improvements
            </h5>
            {improvements.length > 0 ? (
              <ul className="space-y-1.5">
                {improvements.map((imp, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-muted-foreground pl-2 border-l border-warning/30">
                    {imp}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground italic">None noted.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          onClick={onNext}
          disabled={isLoadingNext}
          className="gradient-bg border-0 text-white font-medium hover:opacity-90 transition-opacity gap-2 min-w-[140px]"
        >
          {isLoadingNext ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isLastQuestion ? (
            "Finish Interview"
          ) : (
            <>
              Next Question
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
