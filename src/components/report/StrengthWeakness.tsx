"use client";

import { motion } from "motion/react";
import { candidateReport } from "@/data/mock";
import { CheckCircle2, XCircle } from "lucide-react";

interface StrengthWeaknessProps {
  strengths?: string[];
  weaknesses?: string[];
}

export default function StrengthWeakness({ strengths: propStrengths, weaknesses: propWeaknesses }: StrengthWeaknessProps) {
  const strengths = propStrengths || candidateReport.strengths;
  const weaknesses = propWeaknesses || candidateReport.weaknesses;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Strengths */}
      <div className="glass-card rounded-2xl p-6 border-success/20">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold font-heading text-success">
          <CheckCircle2 className="h-5 w-5" />
          Key Strengths
        </h3>
        <ul className="space-y-3">
          {strengths.map((strength, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              <span>{strength}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="glass-card rounded-2xl p-6 border-destructive/20">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold font-heading text-destructive">
          <XCircle className="h-5 w-5" />
          Areas for Improvement
        </h3>
        <ul className="space-y-3">
          {weaknesses.map((weakness, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
              <span>{weakness}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
