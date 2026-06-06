"use client";

import { useSyncExternalStore } from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { domainDistribution } from "@/data/mock";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function DomainStatistics() {
  const hasMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-full min-h-[350px]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-orange-500" />
            Domain Distribution
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Interviews by technical area</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        {hasMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={domainDistribution}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                stroke="none"
              >
                {domainDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }}
                itemStyle={{ color: "var(--color-foreground)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full min-h-[220px] w-full rounded-xl bg-background/40" />
        )}
        
        <div className="absolute bottom-0 w-full grid grid-cols-2 gap-x-2 gap-y-1 px-4 mt-4">
            {domainDistribution.slice(0, 4).map((entry, index) => (
                <div key={index} className="flex items-center text-xs">
                    <div className="w-2.5 h-2.5 rounded-full mr-2 shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="truncate text-muted-foreground">{entry.domain}</span>
                    <span className="ml-auto font-medium">{entry.percentage}%</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
