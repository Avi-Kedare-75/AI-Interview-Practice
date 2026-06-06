"use client";

import { motion } from "motion/react";
import { candidateReport } from "@/data/mock";
import { Map, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoadmapItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  week: number;
  completed: boolean;
  category: string;
}

interface LearningRoadmapProps {
  roadmap?: RoadmapItem[];
}

export default function LearningRoadmap({ roadmap: propRoadmap }: LearningRoadmapProps) {
  const roadmap = propRoadmap || candidateReport.roadmap;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold font-heading">
          <Map className="h-5 w-5 text-primary" />
          Personalized Learning Roadmap
        </h3>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
          Export Plan <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative border-l border-border ml-3 space-y-8 pb-4">
        {roadmap.map((item, index) => {
          const isCompleted = item.completed;
          const isCurrent = index === 0 && !isCompleted; // Mocking first uncompleted as current
          const itemKey = item.id || index.toString();

          return (
            <motion.div
              key={itemKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative pl-8"
            >
              {/* Timeline dot */}
              <div
                className={`absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background ${
                  isCompleted
                    ? "text-success"
                    : isCurrent
                    ? "text-primary border-2 border-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    : "text-muted-foreground border-2 border-muted"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 bg-background rounded-full" />
                ) : (
                  <Circle className="h-2 w-2 fill-current" />
                )}
              </div>

              <div
                className={`rounded-xl border p-4 transition-colors ${
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background/50 hover:bg-accent"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Week {item.week}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-base font-medium text-foreground mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                {isCurrent && (
                  <Button 
                    size="sm" 
                    className="mt-4 gap-2 gradient-bg text-white border-0"
                    onClick={() => {
                      alert(`Starting modules for Week ${item.week}: ${item.title}`);
                      window.location.href = '/dashboard';
                    }}
                  >
                    Start Week {item.week} <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
