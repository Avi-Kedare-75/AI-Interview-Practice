"use client";

import { motion } from "motion/react";
import { Calendar, Clock, Video } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { DashboardInterviewSession } from "@/types";

export default function UpcomingSessions({ upcoming = [] }: { upcoming?: DashboardInterviewSession[] }) {
  return (
    <div className="glass-card flex h-full flex-col rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold font-heading">Upcoming Sessions</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Schedule New
        </Button>
      </div>

      <div className="flex flex-1 flex-col justify-center space-y-4">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">No upcoming sessions.</p>
        ) : (
          upcoming.slice(0, 3).map((session, index) => (
            <motion.div
              key={session._id?.toString() || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/50 p-4"
            >
              <div className="flex flex-col gap-1">
                <h4 className="font-medium text-foreground">{session.title}</h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(session.createdAt || session.date || new Date()), "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(session.createdAt || session.date || new Date()), "h:mm a")}
                  </span>
                  <span className="capitalize">{session.type.replace("-", " ")}</span>
                </div>
              </div>

              <Button size="sm" className="shrink-0 gradient-bg border-0 text-white group">
                Join
                <Video className="ml-2 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
