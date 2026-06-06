"use client";

import { motion } from "motion/react";
import { domainProgressData as mockDomainProgress } from "@/data/mock";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DomainProgressProps {
  data?: {
    id: string;
    domain: string;
    progress: number;
    completedQuestions: number;
    totalQuestions: number;
  }[];
}

export default function DomainProgress({ data }: DomainProgressProps) {
  const progressData = data || mockDomainProgress;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold font-heading">Domain Mastery</h3>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {progressData.map((domain, index) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{domain.domain}</span>
              <span className="text-muted-foreground">
                {domain.completedQuestions}/{domain.totalQuestions}
              </span>
            </div>
            <div className="relative">
              <Progress value={domain.progress} className="h-2" />
              {/* Optional: Add a glow effect behind the progress bar for highly completed domains */}
              {domain.progress >= 80 && (
                <div 
                  className="absolute inset-0 h-2 bg-primary blur-md opacity-20 rounded-full" 
                  style={{ width: `${domain.progress}%` }} 
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
