"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock } from "lucide-react";

interface InterviewTimerProps {
  timeLimit?: number;
  onTimeout?: () => void;
  isPaused?: boolean;
  /** Changing this key resets the timer */
  resetKey?: string | number;
}

export default function InterviewTimer({
  timeLimit = 120,
  onTimeout,
  isPaused = false,
  resetKey = "",
}: InterviewTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Reset whenever timeLimit or resetKey changes
  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit, resetKey]);

  const handleTimeout = useCallback(() => {
    onTimeout?.();
  }, [onTimeout]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      if (timeLeft <= 0) handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft <= 0, handleTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft < 60;
  const isCritical = timeLeft < 15;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-medium border transition-colors ${
        isCritical
          ? "border-destructive bg-destructive/20 text-destructive animate-pulse"
          : isWarning
            ? "border-destructive/50 bg-destructive/10 text-destructive"
            : "border-border bg-card text-muted-foreground"
      }`}
    >
      <Clock className="h-4 w-4" />
      <span>
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
