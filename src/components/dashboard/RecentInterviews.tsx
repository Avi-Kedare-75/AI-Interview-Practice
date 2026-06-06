"use client";

import { motion } from "motion/react";
import { format } from "date-fns";
import { Play, CheckCircle2, Clock, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardInterviewSession } from "@/types";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ElementType; color: string }> = {
  completed: { label: "Completed", variant: "default", icon: CheckCircle2, color: "text-success" },
  "in-progress": { label: "In Progress", variant: "secondary", icon: Play, color: "text-primary" },
  scheduled: { label: "Scheduled", variant: "outline", icon: CalendarDays, color: "text-warning" },
  cancelled: { label: "Cancelled", variant: "destructive", icon: Clock, color: "text-destructive" },
};

export default function RecentInterviews({ interviews = [] }: { interviews?: DashboardInterviewSession[] }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold font-heading">Recent Interviews</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent interviews found.</p>
        ) : (
          interviews.slice(0, 4).map((interview, index) => {
            const status = statusConfig[interview.status] || statusConfig["in-progress"];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={interview._id?.toString() || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group flex flex-col justify-between gap-4 rounded-xl border border-border bg-background/50 p-4 transition-colors hover:bg-accent sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background ${status.color}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{interview.title}</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {format(new Date(interview.createdAt || interview.date || new Date()), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {interview.duration || "N/A"}
                      </span>
                      <span className="capitalize">{interview.type.replace("-", " ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 ml-12 sm:ml-0">
                  {interview.score !== null && interview.score !== undefined ? (
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">Score</span>
                      <span className={`font-semibold ${interview.score >= 80 ? "text-success" : "text-warning"}`}>
                        {interview.score}/100
                      </span>
                    </div>
                  ) : (
                    <Badge variant={status.variant} className="capitalize">
                      {status.label}
                    </Badge>
                  )}
                  
                  <Button variant="ghost" size="icon" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hidden sm:flex">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
