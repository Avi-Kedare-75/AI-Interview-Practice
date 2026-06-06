"use client";

import { Smile, HeartPulse, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "motion/react";

interface HREmotionIndicatorProps {
  confidenceScore?: number;
  communicationScore?: number;
  isActive?: boolean;
}

export default function HREmotionIndicator({
  confidenceScore,
  communicationScore,
  isActive = false,
}: HREmotionIndicatorProps) {
  const hasData = confidenceScore !== undefined && communicationScore !== undefined;

  // Derive stress level from confidence score
  // High confidence -> low stress, and vice versa
  const getStressLevel = (conf: number) => {
    const stressVal = Math.max(10, 100 - conf);
    let label = "Moderate";
    let colorClass = "text-warning bg-warning/10 border-warning/20";
    if (stressVal < 35) {
      label = "Low";
      colorClass = "text-success bg-success/10 border-success/20";
    } else if (stressVal > 70) {
      label = "High";
      colorClass = "text-destructive bg-destructive/10 border-destructive/20";
    }
    return { value: stressVal, label, colorClass };
  };

  const stress = hasData ? getStressLevel(confidenceScore) : { value: 0, label: "Calculating...", colorClass: "text-muted-foreground bg-muted/20" };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col space-y-4 border border-primary/10 shadow-lg relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      <h3 className="font-semibold font-heading flex items-center justify-between border-b border-border pb-3">
        <span className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-orange-500 animate-pulse" />
          Behavioral Analysis
        </span>
        {isActive && !hasData && (
          <span className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full animate-pulse">
            <Sparkles className="h-2.5 w-2.5" />
            Analyzing
          </span>
        )}
      </h3>

      <div className="space-y-5 pt-2">
        {/* Confidence Progress */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Smile className="h-3.5 w-3.5 text-success" /> Confidence
            </span>
            <span className={`font-semibold ${hasData ? "text-success" : "text-muted-foreground animate-pulse"}`}>
              {hasData ? `${confidenceScore}%` : "Analyzing..."}
            </span>
          </div>
          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-success rounded-full"
              initial={{ width: 0 }}
              animate={{ width: hasData ? `${confidenceScore}%` : "0%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Communication Score */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-violet-500" /> Communication
            </span>
            <span className={`font-semibold ${hasData ? "text-violet-500" : "text-muted-foreground animate-pulse"}`}>
              {hasData ? `${communicationScore}%` : "Analyzing..."}
            </span>
          </div>
          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: hasData ? `${communicationScore}%` : "0%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stress Level */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-warning" /> Stress Index
            </span>
            <span className={`font-semibold ${hasData ? "text-warning" : "text-muted-foreground animate-pulse"}`}>
              {hasData ? stress.label : "Analyzing..."}
            </span>
          </div>
          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-warning rounded-full"
              initial={{ width: 0 }}
              animate={{ width: hasData ? `${stress.value}%` : "0%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center mt-2 pt-2 border-t border-border/50">
        {!hasData 
          ? "Speak or type to begin behavioral response analysis" 
          : "AI-inferred from communication confidence and structural markers"}
      </p>
    </div>
  );
}
