"use client";

import { motion } from "motion/react";
import {
  Users,
  Mic,
  Code,
  MessageSquare,
  FileText,
  BarChart3,
} from "lucide-react";
import { features } from "@/data/mock";

const iconMap: Record<string, React.ElementType> = {
  Users,
  Mic,
  Code,
  MessageSquare,
  FileText,
  BarChart3,
};

export default function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">
            Everything You Need to{" "}
            <span className="gradient-text">Land Your Dream Job</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our comprehensive platform covers every aspect of interview
            preparation — from technical deep-dives to behavioral assessments.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComp = iconMap[feature.icon] || Code;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold font-heading">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                {/* Hover gradient border effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 gradient-border pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
