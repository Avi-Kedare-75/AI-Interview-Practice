"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { skillScores } from "@/data/mock";

interface SkillRadarChartProps {
  data?: any[];
}

export default function SkillRadarChart({ data }: SkillRadarChartProps) {
  const chartData = data || skillScores;

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-[400px]">
      <h3 className="mb-2 text-lg font-semibold font-heading">Skill Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Your performance across key evaluation metrics
      </p>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="currentColor" className="text-border opacity-50" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "currentColor", fontSize: 12 }}
              className="text-muted-foreground"
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="var(--color-violet)"
              strokeWidth={2}
              fill="var(--color-violet)"
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "0.5rem",
                color: "var(--color-foreground)",
              }}
              itemStyle={{ color: "var(--color-foreground)" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
