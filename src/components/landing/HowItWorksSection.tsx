"use client";

import { motion } from "motion/react";
import { Upload, Settings, Bot, FileCheck } from "lucide-react";
import { howItWorksSteps } from "@/data/mock";

const iconMap: Record<string, React.ElementType> = {
  Upload,
  Settings,
  Bot,
  FileCheck,
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-24 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">
            How <span className="gradient-text">HireMind AI</span> Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get interview-ready in 4 simple steps
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-primary/50 via-cyan-accent/50 to-transparent md:left-1/2" />

          {howItWorksSteps.map((step, index) => {
            const IconComp = iconMap[step.icon] || Upload;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative mb-12 flex items-center gap-6 last:mb-0 md:gap-12 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step content */}
                <div className={`ml-20 flex-1 md:ml-0 ${isEven ? "md:text-right" : "md:text-left"}`}>
                  <div
                    className={`rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5 ${
                      isEven ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <span className="mb-2 inline-block text-xs font-semibold text-primary uppercase tracking-wider">
                      Step {step.step}
                    </span>
                    <h3 className="mb-2 text-lg font-semibold font-heading">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center icon */}
                <div className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full gradient-bg text-white shadow-lg md:static md:h-12 md:w-12 shrink-0">
                  <IconComp className="h-4 w-4 md:h-5 md:w-5" />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden flex-1 md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
