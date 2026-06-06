"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current = 3, total = 10 }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="flex w-full items-center gap-4">
      <div className="flex-1">
        <Progress value={progress} className="h-2 w-full" />
      </div>
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        Question {current} of {total}
      </span>
    </div>
  );
}
