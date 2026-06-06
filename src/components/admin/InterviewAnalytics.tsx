"use client";

import { useSyncExternalStore } from "react";
import { MessageSquare } from "lucide-react";
import { adminStats, interviewTrend } from "@/data/mock";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InterviewAnalytics() {
  const hasMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-cyan-500" />
            Interview Volume
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Daily sessions conducted</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Sessions</p>
          <p className="text-2xl font-bold font-heading">{adminStats.totalInterviews.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Avg Score</p>
          <p className="text-2xl font-bold font-heading text-cyan-500">{adminStats.avgScore}</p>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] w-full">
        {hasMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={interviewTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} dy={10} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                cursor={{ fill: "var(--color-accent)", opacity: 0.5 }}
                contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }}
              />
              <Bar
                dataKey="value"
                name="Interviews"
                fill="var(--color-cyan-accent)"
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full min-h-[200px] w-full rounded-xl bg-background/40" />
        )}
      </div>
    </div>
  );
}
