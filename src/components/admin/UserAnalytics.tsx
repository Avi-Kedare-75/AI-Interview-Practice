"use client";

import { useSyncExternalStore } from "react";
import { Users, TrendingUp } from "lucide-react";
import { adminStats, signupTrend } from "@/data/mock";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function UserAnalytics() {
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
            <Users className="h-5 w-5 text-primary" />
            User Growth
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Platform signups over time</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
          <TrendingUp className="h-4 w-4" />
          +{adminStats.growthRate}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Users</p>
          <p className="text-2xl font-bold font-heading">{adminStats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-background/50 p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Active Now</p>
          <p className="text-2xl font-bold font-heading text-primary">{adminStats.activeUsers.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] w-full">
        {hasMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={signupTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} dy={10} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }}
                itemStyle={{ color: "var(--color-foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Signups"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--color-background)" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full min-h-[200px] w-full rounded-xl bg-background/40" />
        )}
      </div>
    </div>
  );
}
