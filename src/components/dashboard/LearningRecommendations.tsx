"use client";

import { motion } from "motion/react";
import { Lightbulb, ArrowRight, Clock, Target, BookOpen } from "lucide-react";
import { learningRecommendations } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LearningRecommendationsProps {
  data?: {
    id: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    estimatedTime: string;
    category: string;
  }[];
}

export default function LearningRecommendations({ data }: LearningRecommendationsProps) {
  const recommendationsData = data || learningRecommendations;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Recommended Focus Areas
        </h3>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          View Roadmap <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendationsData.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative flex flex-col rounded-xl border border-border bg-background/50 p-5 transition-shadow hover:bg-accent"
          >
            <div className="mb-3 flex items-start justify-between">
              <Badge
                variant="outline"
                className={`
                  ${rec.priority === "high" ? "border-destructive/50 text-destructive bg-destructive/10" : ""}
                  ${rec.priority === "medium" ? "border-warning/50 text-warning bg-warning/10" : ""}
                  ${rec.priority === "low" ? "border-success/50 text-success bg-success/10" : ""}
                `}
              >
                {rec.priority} Priority
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {rec.estimatedTime}
              </div>
            </div>

            <h4 className="mb-2 font-medium text-foreground">{rec.title}</h4>
            <p className="mb-4 text-xs text-muted-foreground line-clamp-2">
              {rec.description}
            </p>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                {rec.category}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
              >
                Start
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
